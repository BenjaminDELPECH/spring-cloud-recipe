package com.delpech.userservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Map<Class<? extends Exception>, String> exceptionMap = new HashMap<>();

    static {
        exceptionMap.put(UserAlreadyExistException.class, "Adresse Email déjà utilisée.");
        exceptionMap.put(BadCredentialsException.class, "Mauvais identifiants. Veuillez réessayer.");
        exceptionMap.put(AccountExpiredException.class, "Votre compte a expiré.");
        exceptionMap.put(LockedException.class, "Votre compte est verrouillé.");
        exceptionMap.put(DisabledException.class, "Votre compte est désactivé.");
        exceptionMap.put(CredentialsExpiredException.class, "Vos identifiants ont expiré.");
        exceptionMap.put(InsufficientAuthenticationException.class, "Authentification insuffisante.");
    }

    public static String handleException(Exception ex) {
        return exceptionMap.getOrDefault(ex.getClass(), "Erreur d'authentification.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(handleException(ex), HttpStatus.UNAUTHORIZED);
    }
}