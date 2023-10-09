package com.recipemanager.recipemanager.services;

import com.edelpech.sharedlibrarystarter.UserUtils;
import com.recipemanager.recipemanager.dto.*;
import com.recipemanager.recipemanager.entity.Recipe;
import com.recipemanager.recipemanager.entity.RecipeFood;
import com.recipemanager.recipemanager.feign.StoreFoodNutrient;
import com.recipemanager.recipemanager.repository.RecipeFoodRepository;
import com.recipemanager.recipemanager.repository.RecipeRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@AllArgsConstructor
@Service
public class RecipeService {
    private final StoreFoodNutrient storeFoodNutrient;

    private final RecipeRepository recipeRepository;
    private final RecipeFoodRepository recipeFoodRepository;

    public RecipeDto getCompleteRecipe(Long id) {
        return getCompleteRecipe(
                getRecipe(id)
        );
    }

    public RecipeDto getCompleteRecipe(Recipe recipe) {
        return new RecipeDto(recipe.getId()
                , recipe.getName()
                , recipe.getRecipeFoods().stream()
                .map(recipeFood -> {
                    FoodMinimal foodMinimal = storeFoodNutrient.getFoodMinimal(recipeFood.getFoodId());
                    ConversionFactorMinimal conversionFactorMinimal = storeFoodNutrient.getConversionFactorMinimal(recipeFood.getConversionFactorId());

                    return new RecipeFoodDto(
                            recipeFood.getId(),
                            foodMinimal,
                            conversionFactorMinimal,
                            recipeFood.getQuantity()
                    );
                }).collect(Collectors.toSet()));
    }

    public List<RecipeDto> findByCreatedByUserId() {
        return recipeRepository.findByCreatedBy(UserUtils.getUserId()).stream()
                .map(this::getCompleteRecipe)
                .toList();
    }

    public RecipeDto createRecipe(RecipeDto recipeDto) {
        Recipe recipe = new Recipe();
        recipe.setName(recipeDto.name());
        recipeDto.recipeFoods().forEach(recipeFoodDto -> {
            recipe.addRecipeFood(
                    recipeFoodDto.food().id(),
                    recipeFoodDto.conversionFactor().id(),
                    recipeFoodDto.quantity()
            );
        });
        return getCompleteRecipe(recipeRepository.save(recipe));
    }

    public Recipe updateRecipe(Long id, Recipe recipe) {
        Recipe recipeAlready = getRecipe(id);
        recipeAlready.setName(recipe.getName());
        recipeAlready.setRecipeFoods(recipe.getRecipeFoods());
        return recipeRepository.save(recipe);
    }


    public void deleteRecipe(Long id) {
        Recipe recipe = getRecipe(id);
        recipeRepository.delete(recipe);
    }

    public RecipeDto addRecipeFood(Long id, RecipeFoodDto recipeFoodDto) {
        Recipe recipe = getRecipe(id);
        recipe.addRecipeFood(
                recipeFoodDto.food().id(),
                recipeFoodDto.conversionFactor().id(),
                recipeFoodDto.quantity()
        );
        return getCompleteRecipe(recipe);
    }

    public RecipeDto updateRecipeFood(Long recipeFoodId, RecipeFoodDto recipeFoodDto) {
        RecipeFood recipeFoodAlready = getRecipeFood(recipeFoodId);
        recipeFoodAlready.setFoodId(recipeFoodDto.food().id());
        recipeFoodAlready.setQuantity(recipeFoodDto.quantity());
        recipeFoodAlready.setConversionFactorId(recipeFoodDto.conversionFactor().id());
        return getCompleteRecipe(recipeFoodAlready.getRecipe());
    }

    public RecipeDto deleteRecipeFood(Long recipeFoodId) {
        RecipeFood recipeFood = getRecipeFood(recipeFoodId);
        Recipe recipe = recipeFood.getRecipe();
        recipe.setRecipeFoods(
                recipe.getRecipeFoods().stream()
                        .filter(e -> !e.getId().equals(recipeFoodId))
                        .collect(Collectors.toSet())
        );
        recipeFoodRepository.delete(recipeFood);
        return getCompleteRecipe(recipe);
    }

    private Recipe getRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id).orElseThrow(NotFoundException::new);
        return recipe;
    }

    private RecipeFood getRecipeFood(Long id) {
        return recipeFoodRepository.findById(id).orElseThrow(NotFoundException::new);
    }


    public RecipeNutritionalValues getRecipeNutritionalValues(Long id) {
        Recipe recipe = getRecipe(id);
        List<Long> foodIds = recipe.getRecipeFoods().stream()
                .map(RecipeFood::getFoodId)
                .toList();
        List<NutritionalValue> nutritionalValues = storeFoodNutrient.getNutritionalValues(foodIds);
        return new RecipeNutritionalValues(
                nutritionalValues,
                recipe.getId()
        );
    }
}
