package com.delpech.userservice.controller;

import com.delpech.userservice.responses.JwtResponse;
import com.delpech.userservice.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@AllArgsConstructor
@RestController
@RequestMapping("auth")
public class AuthController {
    private final UserService userService;

    @PostMapping("/exchangeGoogleToken")
    public ResponseEntity<JwtResponse> exchangeGoogleToken(@RequestBody GoogleBodyRequest googleBodyRequest) throws GeneralSecurityException, IOException {
        return ResponseEntity.ok(
                userService.getJwtResponse(googleBodyRequest.googleToken)
        );
    }

    public record GoogleBodyRequest(String googleToken) {
    }
}
