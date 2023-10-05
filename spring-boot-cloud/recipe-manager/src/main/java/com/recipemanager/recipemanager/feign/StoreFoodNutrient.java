package com.recipemanager.recipemanager.feign;

import com.recipemanager.recipemanager.dto.ConversionFactorMinimal;
import com.recipemanager.recipemanager.dto.FoodMinimal;
import com.recipemanager.recipemanager.dto.NutritionalValue;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("food-nutrients")
public interface StoreFoodNutrient {
//    @RequestMapping(method = RequestMethod.GET, value = "/foods")
//    List<FoodMinimal> getFoods(@RequestParam("foodIds") List<Long> ids);

    @RequestMapping(method = RequestMethod.GET, value = "api/food-nutrients/nutrient-values")
    List<NutritionalValue> getNutritionalValues(@RequestParam("foodIds") List<Long> ids);
//
//    @RequestMapping(method = RequestMethod.GET, value = "/conversion-factors")
//    List<FoodConversionFactor> getConversionFactorValues(@RequestParam("conversionFactorIds") List<Long> ids);

    @RequestMapping(method = RequestMethod.GET, value = "api/food-nutrients/foods/{foodId}")
    FoodMinimal getFoodMinimal(@PathVariable("foodId") Long foodId);

    @RequestMapping(method = RequestMethod.GET, value = "api/food-nutrients/conversion-factors/{conversionFactorId}")
    ConversionFactorMinimal getConversionFactorMinimal(@PathVariable("conversionFactorId") Long conversionFactorId);

//    @RequestMapping(method = RequestMethod.GET, value = "/measures/{measureId}")
//    MeasureMinimal getMeasureMinimal(@PathVariable("measureId") Long measureId);
}
