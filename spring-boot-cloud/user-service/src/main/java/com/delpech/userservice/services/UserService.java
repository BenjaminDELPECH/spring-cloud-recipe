package com.delpech.userservice.services;

import com.delpech.userservice.dto.SignInRequest;
import com.delpech.userservice.dto.SignUpRequest;
import com.delpech.userservice.entities.RefreshToken;
import com.delpech.userservice.entities.RefreshTokenRepository;
import com.delpech.userservice.entities.User;
import com.delpech.userservice.entities.UserRole;
import com.delpech.userservice.enums.RoleType;
import com.delpech.userservice.exceptions.UserAlreadyExistException;
import com.delpech.userservice.repository.UserRepository;
import com.delpech.userservice.responses.JwtResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import utils.JwtTokenProvider;
import utils.UserUtils;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Optional;

@AllArgsConstructor
@Service
@Import(JwtTokenProvider.class)
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final JwtTokenProvider jwtTokenProvider;


    public JwtResponse getJwtResponse(String googleId) throws GeneralSecurityException, IOException {
        User user = findOrCreateUserFromGoogleId(googleId);
        return getJwtResponseEntity(
                user.getEmail(),
                user.getPassword()
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
            user.getRoles().add(
                    new UserRole(RoleType.USER)
            );
            return userRepository.save(user);
        } else {
            return googleUser.get();
        }
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

    public Boolean signUp(SignUpRequest signUpRequest) throws UserAlreadyExistException {
        String email = signUpRequest.email();
        String password = signUpRequest.password();
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            throw new UserAlreadyExistException("Un utilisateur avec cet email existe déjà");
        }
        String encodedPassword = passwordEncoder.encode(password);

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(encodedPassword);
        newUser.getRoles().add(new UserRole(RoleType.USER));

        userRepository.save(newUser);

        return true;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
    }

    public JwtResponse signIn(SignInRequest signInRequest) {
        return getJwtResponseEntity(
                signInRequest.email(),
                signInRequest.password()
        );
    }

    private JwtResponse getJwtResponseEntity(String email, String password) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                email, password
        );
        Authentication authentication = authenticationManager.authenticate(
                usernamePasswordAuthenticationToken
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);

        String jwt = jwtTokenProvider.generateToken(UserUtils.getUserId(), user.getRoleAsStringList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new JwtResponse(
                jwt,
                refreshToken.getToken(),
                user.getUsername(),
                user.getRoleTypeList()
        );
    }
}
