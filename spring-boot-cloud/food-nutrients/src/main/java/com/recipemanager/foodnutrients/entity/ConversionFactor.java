package com.recipemanager.foodnutrients.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "conversion_factor")
public class ConversionFactor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "food_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Food food;

    @ManyToOne(optional = false)
    @JoinColumn(name = "measure_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Measure measure;

    private Float factor;


    public ConversionFactor(Long id){
        this.id = id;
    }
}
