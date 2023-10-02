package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
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
    private Set<ConversionFactor> conversionFactors = new HashSet<>();
}
