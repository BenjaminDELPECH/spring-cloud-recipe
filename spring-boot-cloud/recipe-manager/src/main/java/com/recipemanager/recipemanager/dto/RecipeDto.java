package com.recipemanager.recipemanager.dto;

import java.util.Set;

public record RecipeDto(
        Long id,
        String name,
        Set<RecipeFoodDto> recipeFoods
) {
}
