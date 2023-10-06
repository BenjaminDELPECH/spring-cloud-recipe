package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.dto.FoodMinimal;
import com.recipemanager.foodnutrients.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    // search and projection into FoodMinimal
    @Query("""
            select new com.recipemanager.foodnutrients.dto.FoodMinimal(f.id, f.nameFrench)
            from Food f
            where concat('%', lower(f.nameFrench), '%' ) like
                  concat('%', lower(:name), '%' )
            """)
    List<FoodMinimal> searchFood(String name);

    @Query("select f.id from Food f")
    List<Long> getFoodIds();

}