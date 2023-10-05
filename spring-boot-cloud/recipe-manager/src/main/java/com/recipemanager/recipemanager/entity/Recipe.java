package com.recipemanager.recipemanager.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "recipe")
public class Recipe extends BaseEntity {
    String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "recipe")
    private Set<RecipeFood> recipeFoods = new HashSet<>();

    public void addRecipeFood(Long foodId, Long conversionFactorId, Float quantity){
        this.recipeFoods.add(
                new RecipeFood(
                        foodId,
                        conversionFactorId,
                        quantity,
                        this
                )
        );
    }
}
