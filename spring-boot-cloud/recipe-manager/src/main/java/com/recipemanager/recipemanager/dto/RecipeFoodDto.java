package com.recipemanager.recipemanager.dto;

public record RecipeFoodDto(
        Long id,
        FoodMinimal food,
        ConversionFactorMinimal conversionFactor,
        Float quantity

) {
}
