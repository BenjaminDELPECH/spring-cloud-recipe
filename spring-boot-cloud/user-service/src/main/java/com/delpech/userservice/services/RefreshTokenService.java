package com.delpech.userservice.services;

import com.delpech.userservice.entities.RefreshToken;
import com.delpech.userservice.entities.RefreshTokenRepository;
import com.delpech.userservice.entities.User;
import com.delpech.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        return refreshTokenRepository.save(refreshToken);
    }


//    private RefreshToken getRefreshToken(String token){
//        return refreshTokenRepository.findBy()
//    }
}
