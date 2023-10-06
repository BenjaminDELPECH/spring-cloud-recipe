package com.recipemanager.foodnutrients.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "nutrient_group")
public class NutrientGroup {
    @Id
    private Long id;
    private String name;
    private String nameFr;

    @JsonIgnore
    @OneToMany(mappedBy = "nutrientGroup")
    private Set<Nutrient> nutrients = new HashSet<>();
}
