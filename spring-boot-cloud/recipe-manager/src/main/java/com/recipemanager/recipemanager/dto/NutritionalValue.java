package com.recipemanager.recipemanager.dto;

public record NutritionalValue(
        Long foodId,
        Nutrient nutrient,
        Float value
) {
}
