package com.recipemanager.recipemanager.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "recipe_food_")
public class RecipeFood extends BaseEntity {
    private Long foodId;
    private Long conversionFactorId;
    private Float quantity;
    @ManyToOne
    private Recipe recipe;
}
