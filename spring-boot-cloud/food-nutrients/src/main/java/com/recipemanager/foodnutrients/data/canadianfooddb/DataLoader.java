package com.recipemanager.foodnutrients.data.canadianfooddb;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.recipemanager.foodnutrients.entity.ConversionFactor;
import com.recipemanager.foodnutrients.entity.Food;
import com.recipemanager.foodnutrients.entity.FoodRepository;
import com.recipemanager.foodnutrients.entity.Measure;
import com.recipemanager.foodnutrients.repository.ConversionFactorRepository;
import com.recipemanager.foodnutrients.repository.MeasureRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.io.Reader;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@Component
public class DataLoader {

    private static final String CONVERSION_FACTOR_CSV_PATH = "classpath:canadianfoodcsvdata/CONVERSION FACTOR.csv";
    private static final char CSV_SEPARATOR = ',';
    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
    private static final int BATCH_SIZE = 2000;  // Définir la taille du lot selon vos besoins
    private final FoodRepository foodRepository;
    private final ResourceLoader resourceLoader;
    private final MeasureRepository measureRepository;
    private final ConversionFactorRepository conversionFactorRepository;

    @PostConstruct
    @Transactional
    public void loadInitialData() throws Exception {
        this.loadFoods();
        this.loadMeasures();
        this.loadConversionFactors();
    }

    public void loadFoods() throws Exception {

        if (foodRepository.count() > 0) {
            return;
        }


        final Resource resource = resourceLoader.getResource("classpath:canadianfoodcsvdata/FOOD NAME.csv");
        List<Food> foods = new ArrayList<>();
        try (
                Reader reader = Files.newBufferedReader(resource.getFile().toPath())
        ) {
            // ... (code pour lire le fichier CSV)
            int batchSize = 100;
            int count = 0;
            CsvToBean<FoodCsv> csvToBean = new CsvToBeanBuilder<FoodCsv>(reader)
                    .withType(FoodCsv.class)
                    .withSeparator(',')
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            List<FoodCsv> foodLines = csvToBean.parse();
            for (FoodCsv foodCsv : foodLines) {
                Food food = new Food();
                food.setId(foodCsv.getFoodId());  // Ajout de l'ID du CSV
                food.setName(foodCsv.getFoodDescriptionF());
                food.setNameFrench(foodCsv.getFoodDescription());
                foods.add(food);
                if (++count % batchSize == 0) {
                    foodRepository.saveAll(foods);
                    foods.clear();
                }
            }
            if (!foods.isEmpty()) {
                foodRepository.saveAll(foods);
            }
        }
    }

    private void loadMeasures() throws Exception {
        if (measureRepository.count() > 0) {
            return;
        }
        final Resource resource = resourceLoader.getResource("classpath:canadianfoodcsvdata/MEASURE NAME.csv");
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<MeasureCsv> csvToBean = new CsvToBeanBuilder<MeasureCsv>(reader)
                    .withType(MeasureCsv.class)
                    .withSeparator(',')
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            List<MeasureCsv> measureLines = csvToBean.parse();
            for (MeasureCsv measureCsv : measureLines) {
                Measure measure = new Measure();
                measure.setId(measureCsv.getMeasureID());
                measure.setName(measureCsv.getMeasureDescription());
                measure.setNameFrench(measureCsv.getMeasureDescriptionF());
                try {
                    measureRepository.save(measure);
                } catch (Exception e) {
                    logger.error("Error while saving Measure: {}", e.getMessage());
                }
            }
        }
    }

    private void loadConversionFactors() throws Exception {
        if (conversionFactorRepository.count() > 0) {
            return;
        }
        // set.contains is O(1) complexity vs O(n) in list.contains
        Set<Long> foodIds = new HashSet<>(foodRepository.getFoodIds());
        Set<Long> measureIds = new HashSet<>(measureRepository.getMeasureIds());

        final Resource resource = resourceLoader.getResource(CONVERSION_FACTOR_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<ConversionFactorCsv> csvToBean = buildCsvToBean(reader, ConversionFactorCsv.class, CSV_SEPARATOR);
            List<ConversionFactorCsv> conversionFactorLines = csvToBean.parse();

            List<ConversionFactor> conversionFactorsBatch = new ArrayList<>();
            for (ConversionFactorCsv conversionFactorCsv : conversionFactorLines) {

                Long foodId = conversionFactorCsv.getFoodId();
                Long measureId = conversionFactorCsv.getMeasureId();

                if ((foodIds.contains(foodId) == false || measureIds.contains(measureId) == false)) {
                    continue;
                }

                ConversionFactor conversionFactor = mapToConversionFactorEntity(conversionFactorCsv);
                conversionFactorsBatch.add(conversionFactor);

                if (conversionFactorsBatch.size() >= BATCH_SIZE) {
                    try {
                        conversionFactorRepository.saveAll(conversionFactorsBatch);
                    } catch (DataIntegrityViolationException e) {
                        logger.error("Erreur d'intégrité des données lors de l'insertion par lots: {}", e.getMessage());
                    }
                    conversionFactorsBatch.clear();
                }
            }

        }
    }

    private <T> CsvToBean<T> buildCsvToBean(Reader reader, Class<T> type, char separator) {
        return new CsvToBeanBuilder<T>(reader)
                .withType(type)
                .withSeparator(separator)
                .withIgnoreLeadingWhiteSpace(true)
                .build();
    }

    private ConversionFactor mapToConversionFactorEntity(ConversionFactorCsv conversionFactorCsv) {
        ConversionFactor conversionFactor = new ConversionFactor();
        conversionFactor.setFood(new Food(conversionFactorCsv.getFoodId()));
        conversionFactor.setMeasure(new Measure(conversionFactorCsv.getMeasureId()));
        conversionFactor.setFactor(conversionFactorCsv.getConversionFactorValue());
        return conversionFactor;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FoodCsv {
        Long FoodId;
        String FoodDescription;
        String FoodDescriptionF;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeasureCsv {
        Long MeasureID;
        String MeasureDescription;
        String MeasureDescriptionF;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversionFactorCsv {
        Long FoodId;
        Long MeasureId;
        Float ConversionFactorValue;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientCsv {
        Long NutrientID;
        String NutrientUnit;
        String NutrientName;
        String NutrientNameF;
    }
}