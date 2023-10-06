package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.entity.Nutrient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NutrientRepository extends JpaRepository<Nutrient, Long> {
    List<Nutrient> findAllByOrderByNameFr();


    @Query("""
            select n from Nutrient n 
            where n.nutrientGroup.id is not null
            order by n.nameFr
            """)
    List<Nutrient> findNutrientsWithNutrientGroupId();
}