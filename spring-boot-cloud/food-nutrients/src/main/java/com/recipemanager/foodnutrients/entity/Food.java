package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "food")
public class Food extends BaseEntity {
    private String name;

    @OneToMany(mappedBy = "food")
    private Set<ConversionFactor> conversionFactors = new HashSet<>();
}
