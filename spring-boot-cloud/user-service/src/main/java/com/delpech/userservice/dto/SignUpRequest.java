package com.delpech.userservice.dto;

public record SignUpRequest(
        String email,
        String password
) {
}
