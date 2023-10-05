package com.recipemanager.foodnutrients.data.canadianfooddb;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.recipemanager.foodnutrients.repository.FoodNutrientRepository;
import com.recipemanager.foodnutrients.repository.NutrientRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@AllArgsConstructor
@Component
public class NutrientFoodValueDataLoader implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final NutrientRepository nutrientRepository;
    private final FoodNutrientRepository foodNutrientRepository;
    private static final char CSV_SEPARATOR = ',';
    private static final String NUTRIENT_CSV_PATH = "classpath:canadianfoodcsvdata/nutrient_name_ready_copy_command.csv";
    private static final String NUTRIENT_FOOD_CSV_PATH = "classpath:canadianfoodcsvdata/NUTRIENT AMOUNT.csv";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (nutrientRepository.count() == 0) {
            importNutrients();
        }
        if (foodNutrientRepository.count() == 0) {
            importNutrientFoods();
        }
    }

    private void importNutrients() throws IOException {
        final Resource resource = resourceLoader.getResource(NUTRIENT_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<NutrientCsv> nutrientBeans = buildCsvToBean(reader, NutrientCsv.class, CSV_SEPARATOR);
            List<NutrientCsv> nutrientCsvList = nutrientBeans.parse();
            jdbcTemplate.batchUpdate("insert into nutrient (id, code, unit, name, name_fr) values (?,?,?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            NutrientCsv nutrient = nutrientCsvList.get(i);
                            ps.setLong(1, nutrient.id);
                            ps.setString(2, nutrient.code);
                            ps.setString(3, nutrient.unit);
                            ps.setString(4, nutrient.name);
                            ps.setString(5, nutrient.nameFr);
                        }

                        @Override
                        public int getBatchSize() {
                            return nutrientCsvList.size();
                        }
                    });
        }
    }

    private void importNutrientFoods() throws IOException {
        final Resource resource = resourceLoader.getResource(NUTRIENT_FOOD_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<FoodNutrientValueCsv> nutrientBeans = buildCsvToBean(reader, FoodNutrientValueCsv.class, CSV_SEPARATOR);
            List<FoodNutrientValueCsv> csvList = nutrientBeans.parse();
            jdbcTemplate.batchUpdate("insert into food_nutrient (food_id, nutrient_id, value) values (?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            FoodNutrientValueCsv row = csvList.get(i);
                            ps.setLong(1, row.FoodID);
                            ps.setLong(2, row.NutrientID);
                            ps.setFloat(3, row.NutrientValue);
                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
        }
    }

    private <T> CsvToBean<T> buildCsvToBean(Reader reader, Class<T> type, char separator) {
        return new CsvToBeanBuilder<T>(reader)
                .withType(type)
                .withSeparator(separator)
                .withIgnoreLeadingWhiteSpace(true)
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientCsv {
        Long id;
        String code;
        String unit;
        String name;
        String nameFr;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FoodNutrientValueCsv {
        Long FoodID;
        Long NutrientID;
        Float NutrientValue;

    }
}
