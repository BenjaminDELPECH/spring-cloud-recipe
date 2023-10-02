package com.recipemanager.recipemanager.controller;


import com.recipemanager.recipemanager.dto.RecipeNutritionalValues;
import com.recipemanager.recipemanager.entity.Recipe;
import com.recipemanager.recipemanager.entity.RecipeFood;
import com.recipemanager.recipemanager.services.RecipeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("recipes")
public class RecipeController {
    private final RecipeService recipeService;


    @GetMapping
    public ResponseEntity<List<Recipe>> findByCreatedByUserId() {
        return new ResponseEntity<>(
                recipeService.findByCreatedByUserId(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeNutritionalValues> getRecipeNutritionalValues(@PathVariable Long id) {
        // todo use a solution to fetch food nutrients service !
        return new ResponseEntity<>(
                recipeService.getRecipeNutritionalValues(id),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        return new ResponseEntity<>(
                recipeService.createRecipe(recipe),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/{recipeId}/add-recipe-food")
    public ResponseEntity<Recipe> addRecipeFood(@PathVariable Long recipeId, @RequestBody RecipeFood recipeFood) {
        return new ResponseEntity<>(
                recipeService.addRecipeFood(recipeId, recipeFood),
                HttpStatus.OK
        );
    }

    @PutMapping("/update-recipe-food/{recipeFoodId}")
    public ResponseEntity<Recipe> updateRecipeFood(@PathVariable Long recipeFoodId,
                                                   @RequestBody RecipeFood recipeFood) {
        return new ResponseEntity<>(
                recipeService.updateRecipeFood(recipeFoodId, recipeFood),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/delete-recipe-food/{recipeFoodId}")
    public ResponseEntity<Recipe> deleteRecipeFood(@PathVariable Long recipeFoodId) {
        return new ResponseEntity<>(
                recipeService.deleteRecipeFood(recipeFoodId),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        return new ResponseEntity<>(
                recipeService.updateRecipe(id, recipe),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return new ResponseEntity<>(
                true,
                HttpStatus.OK
        );
    }
}
