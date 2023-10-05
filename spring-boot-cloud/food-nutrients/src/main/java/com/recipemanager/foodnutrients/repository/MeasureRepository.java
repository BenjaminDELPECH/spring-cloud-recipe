package com.recipemanager.foodnutrients.repository;

import com.recipemanager.foodnutrients.entity.Measure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MeasureRepository extends JpaRepository<Measure, Long> {
    @Query("select m.id from Measure m")
    List<Long> getMeasureIds();
}