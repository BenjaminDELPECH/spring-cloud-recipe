package com.recipemanager.foodnutrients.entity;

import com.recipemanager.foodnutrients.dto.FoodMinimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    // search and projection into FoodMinimal
    @Query("""
            select new com.recipemanager.foodnutrients.dto.FoodMinimal(f.id, f.name)
            from Food f
            where concat('%', lower(f.name), '%' ) like
                  concat('%', lower(:name), '%' )
            """)
    List<FoodMinimal> searchFood(String name);

    @Query("select f.id from Food f")
    List<Long> getFoodIds();

}