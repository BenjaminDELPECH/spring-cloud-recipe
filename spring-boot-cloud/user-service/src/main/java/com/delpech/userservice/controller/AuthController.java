package com.delpech.userservice.controller;

import com.delpech.userservice.dto.SignInRequest;
import com.delpech.userservice.dto.SignUpRequest;
import com.delpech.userservice.exceptions.UserAlreadyExistException;
import com.delpech.userservice.responses.JwtResponse;
import com.delpech.userservice.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@AllArgsConstructor
@RestController
public class AuthController {
    private final UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest signUpRequest) throws UserAlreadyExistException {
        return new ResponseEntity<>(
                userService.signUp(signUpRequest).getEmail() + " bien enregistré ",
                HttpStatus.OK
        );
    }

    @PostMapping("/sign-in")
    public ResponseEntity<JwtResponse> signIn(@RequestBody SignInRequest signInRequest) {
        return new ResponseEntity<>(
                userService.signIn(signInRequest),
                HttpStatus.OK
        );
    }

    @PostMapping("/exchangeGoogleToken")
    public ResponseEntity<JwtResponse> exchangeGoogleToken(@RequestBody GoogleBodyRequest googleBodyRequest) throws GeneralSecurityException, IOException {
        return ResponseEntity.ok(
                userService.getJwtResponse(googleBodyRequest.googleToken)
        );
    }

    public record GoogleBodyRequest(String googleToken) {
    }
}
