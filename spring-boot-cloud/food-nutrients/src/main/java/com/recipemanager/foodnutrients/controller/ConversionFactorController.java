package com.recipemanager.foodnutrients.controller;

import com.recipemanager.foodnutrients.dto.FoodConversionFactor;
import com.recipemanager.foodnutrients.entity.ConversionFactor;
import com.recipemanager.foodnutrients.service.ConversionFactorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RequestMapping("conversion-factors")
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

    @GetMapping("{id}")
    public ResponseEntity<ConversionFactor> getConversionFactor(@PathVariable("id") Long id){
        return new ResponseEntity<>(
                conversionFactorService.getConversionFactor(id),
                HttpStatus.OK
        );
    }
}
