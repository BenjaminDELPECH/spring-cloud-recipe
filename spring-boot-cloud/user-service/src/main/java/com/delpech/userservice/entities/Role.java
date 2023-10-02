package com.delpech.userservice.entities;

import com.delpech.userservice.enums.RoleType;
import jakarta.persistence.*;
import lombok.Getter;
import utils.BaseEntity;

@Getter
@Entity
@Table(name = "role")
public class Role extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "name")
    private RoleType roleType;
}
