package com.recipemanager.foodnutrients.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "nutrient")
public class Nutrient {
    @Id
    private Long Id;
    private String name;
    private String nameFr;
    private String code;
    private String unit;
}
