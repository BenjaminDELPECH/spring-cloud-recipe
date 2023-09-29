package com.delpech.userservice.responses;

import com.delpech.userservice.enums.RoleType;

import java.util.Set;

public record JwtResponse(
        String token,
        String refreshToken,
        String username,
        Set<RoleType> roles) {
}
