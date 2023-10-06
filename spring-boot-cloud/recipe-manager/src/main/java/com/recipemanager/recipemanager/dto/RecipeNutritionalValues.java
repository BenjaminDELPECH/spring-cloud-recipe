package com.recipemanager.recipemanager.dto;

import java.util.List;

public record RecipeNutritionalValues(
        List<NutritionalValue> foodNutrientValues,
        Long recipeId
) {

}
