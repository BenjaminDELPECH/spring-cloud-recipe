package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "food-nutrient")
public class FoodNutrient extends BaseEntity {

    @OneToOne(optional = false)
    private Food food;

    @OneToOne(optional = false)
    private Nutrient nutrient;

    private Float value;
}
