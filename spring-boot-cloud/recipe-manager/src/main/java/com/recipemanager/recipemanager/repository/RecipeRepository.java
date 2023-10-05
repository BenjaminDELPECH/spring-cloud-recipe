package com.recipemanager.recipemanager.repository;

import com.recipemanager.recipemanager.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query("Select r from Recipe r where r.created_by =:createdBy")
    List<Recipe> findByCreatedBy(Long createdBy);
}