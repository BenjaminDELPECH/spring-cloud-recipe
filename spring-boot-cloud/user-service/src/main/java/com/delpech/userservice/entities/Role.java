package com.delpech.userservice.entities;

import com.delpech.userservice.enums.RoleType;
import com.edelpech.sharedlibrarystarter.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "role")
public class Role extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "name")
    private RoleType roleType;
}
