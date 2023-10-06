package com.recipemanager.foodnutrients.service;

import com.recipemanager.foodnutrients.dto.NutritionalValue;
import com.recipemanager.foodnutrients.repository.FoodNutrientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class FoodNutrientService {
    private final FoodNutrientRepository foodNutrientRepository;

    public List<NutritionalValue> getNutritionalValues(List<Long> foodIds) {
        List<NutritionalValue> nutritionalValues = foodNutrientRepository.findFoodNutrientByFoodIds(foodIds);
        return nutritionalValues;
    }
}
