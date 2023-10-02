package com.recipemanager.foodnutrients.dto;

import com.recipemanager.foodnutrients.entity.Nutrient;

public record NutritionalValue(
        Long foodId,
        Nutrient nutrient,
        Float value
) {
}
