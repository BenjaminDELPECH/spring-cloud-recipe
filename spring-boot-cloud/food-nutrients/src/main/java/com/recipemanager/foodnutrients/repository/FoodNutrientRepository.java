package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.dto.NutritionalValue;
import com.recipemanager.foodnutrients.entity.FoodNutrient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodNutrientRepository extends JpaRepository<FoodNutrient, Long> {
    @Query(value = "select fn.food.id as foodId, fn.nutrient as nutrient, fn.value as value " +
            "from FoodNutrient fn " +
            "where fn.id in :foodIds")
    List<NutritionalValue> findFoodNutrientByFoodIds(List<Long> foodIds);
}