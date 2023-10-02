package com.delpech.userservice.responses;

import com.delpech.userservice.enums.RoleType;

import java.util.List;

public record JwtResponse(
        String token,
        String refreshToken,
        String username,
        List<RoleType> roles) {
}
