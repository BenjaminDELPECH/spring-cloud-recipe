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
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "user_table")
public class User extends BaseEntity implements UserDetails {

    private String email;
    private String password;
    private Boolean isGoogleAccount = Boolean.FALSE;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "user_role_id")
    )
    private Set<UserRole> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(e -> new SimpleGrantedAuthority(e.getRoleType().toString()))
                .toList();
    }

    public List<String> getRoleAsStringList() {
        return this.roles.stream().map(e -> e.getRoleType().toString()).toList();
    }

    public List<RoleType> getRoleTypeList() {
        return this.roles.stream().map(UserRole::getRoleType).toList();
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
