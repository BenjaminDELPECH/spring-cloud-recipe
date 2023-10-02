package com.recipemanager.foodnutrients.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import utils.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "conversion_factor")
public class ConversionFactor extends BaseEntity {
    @ManyToOne
    private Food food;

    @ManyToOne
    private Measure measure;

    private Float factor;

}
