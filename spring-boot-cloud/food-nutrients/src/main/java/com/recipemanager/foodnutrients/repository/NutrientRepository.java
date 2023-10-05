package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.entity.Nutrient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutrientRepository extends JpaRepository<Nutrient, Long> {
}