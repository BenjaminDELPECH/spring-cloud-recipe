package com.recipemanager.recipemanager.entity;

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
@Table(name = "recipe_food")
public class RecipeFood extends BaseEntity {
    private Long foodId;
    private Long conversionFactorId;
    private Float quantity;

    @ManyToOne(optional = false)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
}
