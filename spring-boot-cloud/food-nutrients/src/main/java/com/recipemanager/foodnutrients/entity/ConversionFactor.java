package com.recipemanager.foodnutrients.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import utils.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "conversion_factor")
public class ConversionFactor extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "food_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Food food;

    @ManyToOne(optional = false)
    private Measure measure;

    private Float factor;

}
