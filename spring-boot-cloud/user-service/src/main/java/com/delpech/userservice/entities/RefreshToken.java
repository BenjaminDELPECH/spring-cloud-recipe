package com.delpech.userservice.entities;

import com.edelpech.sharedlibrarystarter.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

// TODO - refresh token
// adding the jwt filter on every microservices
// custoom library, with JwtFilter and JwtUtils
// Try user microservices
// Add api gateway
// add routine/meal microservice
// test if post/put is only possible for the user who create the meal !, use audity entity listern and jpa auditing
@Getter
@Setter
@NoArgsConstructor
@Entity
public class RefreshToken extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String token = UUID.randomUUID().toString();
    private Instant expiryDate = Instant.now().plusSeconds(365 * 24 * 60 * 60);

    public RefreshToken(User user) {
        this.user = user;
    }
}
