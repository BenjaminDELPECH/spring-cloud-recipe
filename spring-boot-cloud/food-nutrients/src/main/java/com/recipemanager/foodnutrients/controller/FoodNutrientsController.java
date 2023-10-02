package com.recipemanager.foodnutrients.controller;


import com.recipemanager.foodnutrients.dto.NutritionalValue;
import com.recipemanager.foodnutrients.service.FoodNutrientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
public class FoodNutrientsController {
    private final FoodNutrientService foodNutrientService;

    @GetMapping("nutrient-values")
    public ResponseEntity<List<NutritionalValue>> getNutritionalValues(@RequestParam List<Long> foodIds) {
        return new ResponseEntity<>(
                foodNutrientService.getNutritionalValues(foodIds),
                HttpStatus.OK
        );
    }
}
