package com.recipemanager.foodnutrients.controller;

import com.recipemanager.foodnutrients.dto.FoodConversionFactor;
import com.recipemanager.foodnutrients.service.ConversionFactorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
public class ConversionFactorController {
    private final ConversionFactorService conversionFactorService;

    @GetMapping("conversion-factors")
    public ResponseEntity<List<FoodConversionFactor>> getConversionFactorValues(@RequestParam List<Long> conversionFactorIds) {
        return new ResponseEntity<>(
                conversionFactorService.getConversionFactorValues(conversionFactorIds),
                HttpStatus.OK
        );
    }
}
