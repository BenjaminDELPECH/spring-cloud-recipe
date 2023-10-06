package com.recipemanager.foodnutrients.controller;

import com.recipemanager.foodnutrients.dto.FoodMinimal;
import com.recipemanager.foodnutrients.entity.Food;
import com.recipemanager.foodnutrients.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@RequestMapping("/foods")
@RestController
public class FoodController {
    private final FoodService foodService;

    @GetMapping("/food-ids")
    public Set<FoodMinimal> foodsByFoodIds(@RequestParam List<Long> longs) {
        return foodService.getFoods(longs);
    }

    @GetMapping
    public List<FoodMinimal> foods(@RequestParam String search) {
        return foodService.searchFood(search);
    }

    @GetMapping("{id}")
    public Food getFood(@PathVariable Long id) {
        return foodService.getFood(id);
    }

}
