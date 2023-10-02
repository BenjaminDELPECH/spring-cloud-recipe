package com.delpech.userservice.dto;

public record SignInRequest(
        String email,
        String password
) {
}
