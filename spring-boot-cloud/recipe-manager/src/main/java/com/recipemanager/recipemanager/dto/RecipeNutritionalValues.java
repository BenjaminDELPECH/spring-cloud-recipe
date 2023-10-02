package com.recipemanager.recipemanager.dto;

import java.util.List;

public record RecipeNutritionalValues(
        List<NutritionalValue> nutrientValues,
        Long recipeId
) {

}
