package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.dto.FoodConversionFactor;
import com.recipemanager.foodnutrients.entity.ConversionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConversionFactorRepository extends JpaRepository<ConversionFactor, Long> {
    @Query(value = "select c.food.id as foodId, c.factor as conversionFactor " +
            "From ConversionFactor c " +
            "where c.id in :conversionFactorIds")
    List<FoodConversionFactor> conversionFactorsByIds(List<Long> conversionFactorIds);
}