package com.recipemanager.recipemanager.entity;

import com.edelpech.sharedlibrarystarter.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "recipe_food")
public class RecipeFood extends BaseEntity {
    @Column(nullable = false)
    private Long foodId;
    @Column(nullable = false)
    private Long conversionFactorId;
    private Float quantity;

    @ManyToOne(optional = false)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
}
