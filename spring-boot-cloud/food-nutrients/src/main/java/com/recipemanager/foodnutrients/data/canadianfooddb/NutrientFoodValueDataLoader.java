package com.recipemanager.foodnutrients.data.canadianfooddb;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.recipemanager.foodnutrients.repository.FoodNutrientRepository;
import com.recipemanager.foodnutrients.repository.NutrientRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(NutrientFoodValueDataLoader.class);
    private static final char CSV_SEPARATOR = ',';

    private static final String NUTRIENT_CSV_PATH = "classpath:canadianfoodcsvdata/nutrient_with_requirements.csv";
    private static final String NUTRIENT_FOOD_CSV_PATH = "classpath:canadianfoodcsvdata/NUTRIENT AMOUNT 2.csv";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (nutrientRepository.count() == 0) {
            long startTime = System.currentTimeMillis();
            importNutrients();
            long endTime = System.currentTimeMillis();
            logger.info("Temps pris pour importNutrients: {} ms", (endTime - startTime));
        }
        if (foodNutrientRepository.count() == 0) {
            logger.info("L'import de la table nutrient foods (environ 500,000 lignes) commence");
            long startTime = System.currentTimeMillis();
            importNutrientFoods();
            long endTime = System.currentTimeMillis();
            logger.info("Temps pris pour importNutrientFoods: {} ms", (endTime - startTime));
        }
    }

    private void importNutrients() throws IOException {
        final Resource resource = resourceLoader.getResource(NUTRIENT_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<NutrientCsv> nutrientBeans = buildCsvToBean(reader, NutrientCsv.class, CSV_SEPARATOR);
            List<NutrientCsv> nutrientCsvList = nutrientBeans.parse();
            jdbcTemplate.batchUpdate("insert into nutrient (id, name, name_fr,symbol, unit , requirement) values (?,?,?,?,?, ?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            NutrientCsv nutrient = nutrientCsvList.get(i);
                            ps.setLong(1, nutrient.NutrientID);
                            ps.setString(2, nutrient.NutrientName);
                            ps.setString(3, nutrient.NutrientNameF);
                            ps.setString(4, nutrient.NutrientSymbol);
                            ps.setString(5, nutrient.NutrientUnit);
                            ps.setFloat(6, nutrient.NutrientRequirement != null ? nutrient.NutrientRequirement : 0);
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
            int total = csvList.size();
            final int[] count = {0};
            // Initialisation de la barre de progression
            printProgressBar(count[0], total);
            jdbcTemplate.batchUpdate("insert into food_nutrient (food_id, nutrient_id, value) values (?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            FoodNutrientValueCsv row = csvList.get(i);
                            ps.setLong(1, row.FoodID);
                            ps.setLong(2, row.NutrientID);
                            ps.setFloat(3, row.NutrientValue);
                            // Mise à jour de la barre de progression
                            printProgressBar(++count[0], total);
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

    private void printProgressBar(int done, int total) {
        int percent = (int) Math.ceil((double) done / total * 100);
        StringBuilder bar = new StringBuilder("[");
        for (int i = 0; i < 100; i += 2) {
            if (i < percent) {
                bar.append("=");
            } else if (i == percent) {
                bar.append(">");
            } else {
                bar.append(" ");
            }
        }
        bar.append("] ").append(percent).append("%");
        System.out.print("\r" + bar);
        if (done == total) {
            System.out.print("\n");
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientCsv {
        Long NutrientID;
        Long NutrientCode;
        String NutrientSymbol;
        String NutrientUnit;
        String NutrientName;
        String NutrientNameF;
        Float NutrientRequirement;
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
