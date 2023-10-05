package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "food")
public class Food {
    @OneToMany(mappedBy = "food")
    Set<ConversionFactor> conversionFactors = new HashSet<>();
    private String name;
    @Id
    private Long id;
    private String nameFrench;

    public Food(Long id) {
        this.id = id;
    }
}
