package com.recipemanager.foodnutrients.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "nutrient")
public class Nutrient {
    @Id
    private Long Id;
    private String name;
    private String nameFr;
    private String symbol;
    private String friendlyNameFr;
    private String unit;
    private Float requirement;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "nutrient_group_id")
    private NutrientGroup nutrientGroup;

}
