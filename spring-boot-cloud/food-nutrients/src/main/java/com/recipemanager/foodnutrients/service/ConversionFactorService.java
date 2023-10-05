package com.recipemanager.foodnutrients.service;

import com.recipemanager.foodnutrients.dto.FoodConversionFactor;
import com.recipemanager.foodnutrients.entity.ConversionFactor;
import com.recipemanager.foodnutrients.repository.ConversionFactorRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ConversionFactorService {
    private final ConversionFactorRepository conversionFactorRepository;

    public List<FoodConversionFactor> getConversionFactorValues(List<Long> ids) {
        return conversionFactorRepository.conversionFactorsByIds(ids);
    }

    public ConversionFactor getConversionFactor(Long id) {
        return conversionFactorRepository.findById(id).orElseThrow(NotFoundException::new);
    }
}
