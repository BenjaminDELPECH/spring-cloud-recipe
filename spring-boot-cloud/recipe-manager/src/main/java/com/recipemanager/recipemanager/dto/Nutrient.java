package com.recipemanager.recipemanager.dto;

public record Nutrient(
        Long id,
        String name,
        String requirement,
        String unit
) {
}
