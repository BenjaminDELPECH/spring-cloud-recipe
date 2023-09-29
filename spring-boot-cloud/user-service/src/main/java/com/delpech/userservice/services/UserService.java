package com.delpech.userservice.services;

import com.delpech.userservice.entities.RefreshToken;
import com.delpech.userservice.entities.RefreshTokenRepository;
import com.delpech.userservice.entities.User;
import com.delpech.userservice.enums.RoleType;
import com.delpech.userservice.repository.UserRepository;
import com.delpech.userservice.responses.JwtResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import utils.JwtTokenProvider;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Optional;

@Service
@Import(JwtTokenProvider.class)
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public JwtResponse getJwtResponse(String googleId) throws GeneralSecurityException, IOException {
        User user = findOrCreateUserFromGoogleId(googleId);
        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getRoles().stream().map(Enum::toString)
                        .toList());
        RefreshToken refreshToken = new RefreshToken(user);
        refreshTokenRepository.save(refreshToken);
        return new JwtResponse(
                token,
                refreshToken.getToken(),
                user.getUsername(),
                user.getRoles()
        );
    }

    public User findOrCreateUserFromGoogleId(String googleToken) throws GeneralSecurityException, IOException {
        GoogleIdToken.Payload googlePayload = getGoogleEmailFromGoogleToken(googleToken);
        String email = googlePayload.getEmail();
        Optional<User> googleUser = userRepository.findByEmail(email);
        User user;
        if (googleUser.isEmpty()) {
            user = new User();
            user.setIsGoogleAccount(true);
            user.setEmail(email);
            user.getRoles().add(RoleType.USER);
            return userRepository.save(user);
        } else {
            return googleUser.get();
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public GoogleIdToken.Payload getGoogleEmailFromGoogleToken(String googleToken) throws IOException, GeneralSecurityException {
        String externalId;

        JsonFactory JSON_FACTORY = new JacksonFactory();
        // Verify that the token is a legitimate google token
        GoogleIdToken token = GoogleIdToken.parse(JSON_FACTORY, googleToken);
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier(new NetHttpTransport(), JSON_FACTORY);
        verifier.verify(token);

        // If we get here then this is a valid google item
        externalId = token.getPayload().getEmail();

        return token.getPayload();
    }
}
