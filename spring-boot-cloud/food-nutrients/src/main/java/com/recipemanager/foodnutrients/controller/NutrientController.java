package com.recipemanager.foodnutrients.controller;

import com.recipemanager.foodnutrients.entity.Nutrient;
import com.recipemanager.foodnutrients.service.NutrientService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RequestMapping("nutrients")
@RestController
public class NutrientController {
    private final NutrientService nutrientService;

    @GetMapping
    public List<Nutrient> nutrientList() {
        return nutrientService.getNutrients();
    }
}
