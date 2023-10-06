package com.recipemanager.foodnutrients.service;

import com.recipemanager.foodnutrients.dto.FoodMinimal;
import com.recipemanager.foodnutrients.entity.Food;
import com.recipemanager.foodnutrients.repository.FoodRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class FoodService {
    private final FoodRepository foodRepository;

    public List<FoodMinimal> searchFood(String search) {
        return foodRepository.searchFood(search);
    }

    public Food getFood(Long id) {
        return foodRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    public Set<FoodMinimal> getFoods(List<Long> longs) {
        return foodRepository.findAllById(longs)
                .stream()
                .map(e -> new FoodMinimal(e.getId(), e.getNameFrench()))
                .collect(Collectors.toSet());
    }

    public FoodMinimal getFoodMinimal(Long id) {
        Food food = getFood(id);
        return new FoodMinimal(
                food.getId(),
                food.getName()
        );
    }
}
