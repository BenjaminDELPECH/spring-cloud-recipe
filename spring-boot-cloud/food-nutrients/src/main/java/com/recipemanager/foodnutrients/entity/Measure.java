package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Table(name = "measure")
@Entity
public class Measure {
    @Id
    private Long id;
    private String name;
    private String nameFrench;

    public Measure(Long id){
        this.id = id;
    }
}
