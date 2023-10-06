package com.recipemanager.foodnutrients.controller;

import com.recipemanager.foodnutrients.entity.ConversionFactor;
import com.recipemanager.foodnutrients.service.ConversionFactorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RequestMapping("conversion-factors")
@RestController
public class ConversionFactorController {
    private final ConversionFactorService conversionFactorService;

    @GetMapping("{id}")
    public ResponseEntity<ConversionFactor> getConversionFactor(@PathVariable("id") Long id){
        return new ResponseEntity<>(
                conversionFactorService.getConversionFactor(id),
                HttpStatus.OK
        );
    }
}
