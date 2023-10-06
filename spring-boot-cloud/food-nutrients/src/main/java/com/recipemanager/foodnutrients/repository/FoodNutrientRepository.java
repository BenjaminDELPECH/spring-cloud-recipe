package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.dto.NutritionalValue;
import com.recipemanager.foodnutrients.entity.FoodNutrient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodNutrientRepository extends JpaRepository<FoodNutrient, Long> {
    @Query("""
            select new com.recipemanager.foodnutrients.dto.NutritionalValue(
                fn.food.id,
                fn.nutrient,
                fn.value
            ) from FoodNutrient fn where fn.food.id in :foodIds and fn.nutrient.requirement != 0
            """)
    List<NutritionalValue> findFoodNutrientByFoodIds(@Param("foodIds") List<Long> foodIds);
}