package com.delpech.userservice.entities;

import com.delpech.userservice.enums.RoleType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import utils.BaseEntity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class User extends BaseEntity implements UserDetails {

    private String email;
    private String password;
    private Boolean isGoogleAccount = Boolean.FALSE;

    @ElementCollection(targetClass = RoleType.class)
    @CollectionTable(name = "user_roles")
    @Enumerated(EnumType.STRING)
    private Set<RoleType> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(e -> new SimpleGrantedAuthority(e.toString()))
                .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
