package com.recipemanager.recipemanager.repository;

import com.recipemanager.recipemanager.entity.RecipeFood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeFoodRepository extends JpaRepository<RecipeFood, Long> {
}