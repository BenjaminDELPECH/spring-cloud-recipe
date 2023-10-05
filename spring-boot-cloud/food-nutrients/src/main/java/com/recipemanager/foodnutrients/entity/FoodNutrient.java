package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "food_nutrient")
public class FoodNutrient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;


    @OneToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Food food;

    @OneToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Nutrient nutrient;

    private Float value;
}
