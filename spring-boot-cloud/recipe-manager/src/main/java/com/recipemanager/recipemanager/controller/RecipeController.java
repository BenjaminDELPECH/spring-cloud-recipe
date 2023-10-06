package com.recipemanager.recipemanager.controller;


import com.recipemanager.recipemanager.dto.RecipeDto;
import com.recipemanager.recipemanager.dto.RecipeFoodDto;
import com.recipemanager.recipemanager.dto.RecipeNutritionalValues;
import com.recipemanager.recipemanager.entity.Recipe;
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
    public ResponseEntity<List<RecipeDto>> findByCreatedByUserId() {
        return new ResponseEntity<>(
                recipeService.findByCreatedByUserId(),
                HttpStatus.OK
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<RecipeDto> getRecipe(@PathVariable Long id) {
        return new ResponseEntity<>(
                recipeService.getCompleteRecipe(id),
                HttpStatus.OK
        );
    }

    @GetMapping("{id}/nutrient-values")
    public ResponseEntity<RecipeNutritionalValues> getRecipeNutritionalValues(@PathVariable Long id) {
        // todo use a solution to fetch food nutrients service !
        return new ResponseEntity<>(
                recipeService.getRecipeNutritionalValues(id),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeDto recipe) {
        return new ResponseEntity<>(
                recipeService.createRecipe(recipe),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/{recipeId}/add-recipe-food")
    public ResponseEntity<RecipeDto> addRecipeFood(@PathVariable Long recipeId, @RequestBody RecipeFoodDto recipeFood) {
        return new ResponseEntity<>(
                recipeService.addRecipeFood(recipeId, recipeFood),
                HttpStatus.OK
        );
    }

    @PostMapping("/{recipeId}/update-recipe-food/{recipeFoodId}")
    public ResponseEntity<RecipeDto> updateRecipeFood(@PathVariable Long recipeId,
                                                      @PathVariable Long recipeFoodId,
                                                      @RequestBody RecipeFoodDto recipeFood) {
        return new ResponseEntity<>(
                recipeService.updateRecipeFood(recipeFoodId, recipeFood),
                HttpStatus.OK
        );
    }

    @PostMapping("/delete-recipe-food/{recipeFoodId}")
    public ResponseEntity<RecipeDto> deleteRecipeFood(@PathVariable Long recipeFoodId) {
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
