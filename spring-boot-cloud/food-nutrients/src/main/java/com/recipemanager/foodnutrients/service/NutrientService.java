package com.recipemanager.foodnutrients.service;

import com.recipemanager.foodnutrients.entity.Nutrient;
import com.recipemanager.foodnutrients.repository.NutrientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class NutrientService {
    private final NutrientRepository nutrientRepository;


    public List<Nutrient> getNutrients() {
        return nutrientRepository.findNutrientsWithNutrientGroupId();
    }
}
