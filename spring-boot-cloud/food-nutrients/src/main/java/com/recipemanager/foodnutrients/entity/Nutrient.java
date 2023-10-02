package com.recipemanager.foodnutrients.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "nutrient")
public class Nutrient extends BaseEntity {
    private String name;
}
