package com.edelpech.sharedlibrarystarter;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.codec.DecodingException;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@EnableJpaAuditing
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class GeneralSecurityConfiguration {
    @Value("${jwt.secret}")
    private String jwtSecret;

    // TODO
//    @Value("${allowed.hosts}")
//    private List<String> allowedHosts;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(httpSecurityCorsConfigurer -> corsConfigurationSource())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request ->
                        request
                                .requestMatchers("/api/user/**").permitAll()
                                .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(
                        jwtAuthFilter()
                        , UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));  // Allow all origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public AuditorAware<Long> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }
            if (authentication instanceof AnonymousAuthenticationToken) {
                return Optional.empty();
            }
            return Optional.ofNullable((Long) authentication.getPrincipal());
        };
    }

    @Bean
    public OncePerRequestFilter oncePerRequestFilter() {
        return new JwtAuthFilter(jwtTokenProvider());
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider(jwtSecret);
    }


    @Bean
    JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtTokenProvider());
    }

    public static class JwtTokenProvider {
        private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
        private final String jwtSecret;

        public JwtTokenProvider(String jwtSecret) {
            this.jwtSecret = jwtSecret;
        }

        public String generateToken(Long userId, List<String> roles) {
            Date now = new Date();
            long jwtExpirationInMs = 365L * 24 * 60 * 60 * 1000;
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            return Jwts.builder()
                    .setSubject(Long.toString(userId))
                    .claim("roles", roles)
                    .setIssuedAt(new Date())
                    .setExpiration(expiryDate)
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        }

        public Long getUserIdFromToken(String token) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody();

                return Long.parseLong(claims.getSubject());
            } catch (JwtException ex) {
                logger.error("Failed to get user ID from token", ex);
                throw new JwtException("Invalid or expired JWT token");
            }
        }

        public List<GrantedAuthority> getAuthoritiesFromToken(String token) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody();

                List<String> roles = claims.get("roles", List.class);
                return roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
            } catch (JwtException ex) {
                logger.error("Failed to get authorities from token", ex);
                throw new JwtException("Invalid or expired JWT token");
            }
        }

        public boolean validateToken(String authToken) {
            try {
                Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
                return true;
            } catch (DecodingException dex) {
                logger.error("Decoding Jwt failed: Illegal characters found", dex);
                return false;
            } catch (JwtException ex) {
                logger.error("Invalid or expired JWT token", ex);
                return false;
            }
        }

    }


    public static class JwtAuthFilter extends OncePerRequestFilter {
        private final JwtTokenProvider jwtTokenProvider;

        public JwtAuthFilter(JwtTokenProvider jwtTokenProvider) {
            this.jwtTokenProvider = jwtTokenProvider;
        }

        public static String removeBearer(String authToken) {
            if (authToken.startsWith("Bearer ")) {
                authToken = authToken.substring(7);
            }
            authToken = authToken.trim();
            return authToken;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain)
                throws ServletException, IOException {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || jwt.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }
            jwt = removeBearer(jwt);
            try {
                if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                    Long userId = jwtTokenProvider.getUserIdFromToken(jwt);
                    List<GrantedAuthority> authorities = jwtTokenProvider.getAuthoritiesFromToken(jwt);

                    Authentication authentication = new UsernamePasswordAuthenticationToken(userId, jwt, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (JwtException ex) {
                logger.error("Could not set user authentication in security context", ex);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired JWT token");
                return;
            }

            filterChain.doFilter(request, response);
        }
    }

}