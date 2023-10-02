package com.recipemanager.recipemanager.feign;

import com.recipemanager.recipemanager.dto.FoodConversionFactor;
import com.recipemanager.recipemanager.dto.NutritionalValue;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "food-nutrients")
public interface StoreFoodNutrient {
    @RequestMapping(method = RequestMethod.GET, value = "/nutrient-values")
    List<NutritionalValue> getNutritionalValues(@RequestParam("foodIds") List<Long> ids);

    @RequestMapping(method = RequestMethod.GET, value = "/conversion-factors")
    List<FoodConversionFactor> getConversionFactorValues(@RequestParam("conversionFactorIds") List<Long> ids);
}
