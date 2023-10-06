package com.recipemanager.foodnutrients.data.canadianfooddb;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.recipemanager.foodnutrients.entity.NutrientGroupRepository;
import com.recipemanager.foodnutrients.repository.*;
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
import java.sql.Types;
import java.util.List;

@AllArgsConstructor
@Component
public class NutrientFoodValueDataLoader implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final NutrientRepository nutrientRepository;
    private final FoodNutrientRepository foodNutrientRepository;
    private static final String NUTRIENT_CSV_PATH = "classpath:canadianfoodcsvdata/NUTRIENT NAME.csv";
    private static final String NUTRIENT_GROUP_CSV_PATH = "classpath:canadianfoodcsvdata/nutrient_groups.csv";
    private static final Logger logger = LoggerFactory.getLogger(NutrientFoodValueDataLoader.class);
    private static final char CSV_SEPARATOR = ',';
    private static final String FOOD_CSV_PATH = "classpath:canadianfoodcsvdata/FOOD NAME.csv";
    private static final String MEASURE_CSV_PATH = "classpath:canadianfoodcsvdata/MEASURE NAME.csv";
    private static final String NUTRIENT_FOOD_CSV_PATH = "classpath:canadianfoodcsvdata/NUTRIENT AMOUNT 2.csv";
    private static final String MEASURE_CSV_ADD_PATH = "classpath:canadianfoodcsvdata/MEASURE NAME ADD.csv";
    private static final String CONVERSION_FACTOR_CSV_PATH = "classpath:canadianfoodcsvdata/CONVERSION FACTOR.csv";
    private final NutrientGroupRepository nutrientGroupRepository;
    private final FoodRepository foodRepository;
    private final MeasureRepository measureRepository;
    private final ConversionFactorRepository conversionFactorRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (measureRepository.count() == 0) {
            importMeasures();
            importMeasuresAdd();
        }
        if (foodRepository.count() == 0) {
            importFoods();
        }
        if (conversionFactorRepository.count() == 0) {
            importFoodConversionFactors();
        }
        if (nutrientGroupRepository.count() == 0) {
            importNutrientGroups();
        }
        if (nutrientRepository.count() == 0) {
            importNutrients();
        }
        if (foodNutrientRepository.count() == 0) {
            importNutrientFoods();
        }
    }

    private void importMeasures() throws IOException {
        final Resource resource = resourceLoader.getResource(MEASURE_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<MeasureCsv> beans = buildCsvToBean(reader, MeasureCsv.class, CSV_SEPARATOR);
            List<MeasureCsv> csvList = beans.parse();
            jdbcTemplate.batchUpdate("insert into measure (id, name, name_french) values (?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            MeasureCsv csv = csvList.get(i);
                            ps.setLong(1, csv.MeasureID);
                            ps.setString(2, csv.MeasureDescription);
                            ps.setString(3, csv.MeasureDescriptionF);
                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
        }
    }

    private void importMeasuresAdd() throws IOException {
        final Resource resource = resourceLoader.getResource(MEASURE_CSV_ADD_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<MeasureCsv> beans = buildCsvToBean(reader, MeasureCsv.class, CSV_SEPARATOR);
            List<MeasureCsv> csvList = beans.parse();
            jdbcTemplate.batchUpdate("""
                            insert into measure (id, name, name_french) values (?,?,?) on conflict (id) do update set (id,name, name_french) = (?,?,?)
                            """,
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            MeasureCsv csv = csvList.get(i);
                            ps.setLong(1, csv.MeasureID);
                            ps.setString(2, csv.MeasureDescription);
                            ps.setString(3, csv.MeasureDescriptionF);
                            ps.setLong(4, csv.MeasureID);
                            ps.setString(5, csv.MeasureDescription);
                            ps.setString(6, csv.MeasureDescriptionF);

                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
        }
    }

    private void importFoods() throws IOException {
        final Resource resource = resourceLoader.getResource(FOOD_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<FoodCsv> beans = buildCsvToBean(reader, FoodCsv.class, CSV_SEPARATOR);
            List<FoodCsv> csvList = beans.parse();
            jdbcTemplate.batchUpdate("insert into food (id, name, name_french) values (?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            FoodCsv csv = csvList.get(i);
                            ps.setLong(1, csv.FoodId);
                            ps.setString(2, csv.FoodDescription);
                            ps.setString(3, csv.FoodDescriptionF);
                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
        }

    }

    private void importFoodConversionFactors() throws IOException {
        final Resource resource = resourceLoader.getResource(CONVERSION_FACTOR_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            logger.info("L'import de la table conversion_factor commence");
            long startTime = System.currentTimeMillis();
            CsvToBean<ConversionFactorCsv> beans = buildCsvToBean(reader, ConversionFactorCsv.class, CSV_SEPARATOR);
            List<ConversionFactorCsv> csvList = beans.parse();
            jdbcTemplate.batchUpdate("insert into conversion_factor ( food_id, measure_id, factor) values (?,?, ?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            ConversionFactorCsv csv = csvList.get(i);
                            ps.setLong(1, csv.FoodID);
                            ps.setLong(2, csv.MeasureID);
                            ps.setFloat(3, csv.ConversionFactorValue);
                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
            long endTime = System.currentTimeMillis();
            logger.info("Temps pris pour importFoodConversionFactors: {} ms", (endTime - startTime));
        }
    }


    private void importNutrientGroups() throws IOException {
        final Resource resource = resourceLoader.getResource(NUTRIENT_GROUP_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            CsvToBean<NutrientGroupCsv> beans = buildCsvToBean(reader, NutrientGroupCsv.class, CSV_SEPARATOR);
            List<NutrientGroupCsv> csvList = beans.parse();
            jdbcTemplate.batchUpdate("insert into nutrient_group (id, name, name_fr) values (?,?,?)",
                    new BatchPreparedStatementSetter() {
                        @Override
                        public void setValues(PreparedStatement ps, int i) throws SQLException {
                            NutrientGroupCsv nutrientGroupCsv = csvList.get(i);
                            ps.setLong(1, nutrientGroupCsv.NutrientGroupID);
                            ps.setString(2, nutrientGroupCsv.NutrientGroupName);
                            ps.setString(3, nutrientGroupCsv.NutrientGroupNameFr);
                        }

                        @Override
                        public int getBatchSize() {
                            return csvList.size();
                        }
                    });
        }
    }

    private void importNutrients() throws IOException {

        final Resource resource = resourceLoader.getResource(NUTRIENT_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            long startTime = System.currentTimeMillis();
            CsvToBean<NutrientCsv> nutrientBeans = buildCsvToBean(reader, NutrientCsv.class, CSV_SEPARATOR);
            List<NutrientCsv> nutrientCsvList = nutrientBeans.parse();
            jdbcTemplate.batchUpdate("insert into nutrient (id, name, name_fr,symbol, unit , requirement, nutrient_group_id) values (?,?,?,?,?, ?, ?)",
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
                            if (nutrient.NutrientGroupID != null) {
                                ps.setLong(7, nutrient.NutrientGroupID);
                            } else {
                                ps.setNull(7, Types.BIGINT);
                            }
                        }

                        @Override
                        public int getBatchSize() {
                            return nutrientCsvList.size();
                        }
                    });
            long endTime = System.currentTimeMillis();
            logger.info("Temps pris pour importNutrients: {} ms", (endTime - startTime));
        }

    }

    private void importNutrientFoods() throws IOException {

        final Resource resource = resourceLoader.getResource(NUTRIENT_FOOD_CSV_PATH);
        try (Reader reader = Files.newBufferedReader(resource.getFile().toPath())) {
            logger.info("L'import de la table nutrient foods (environ 500,000 lignes) commence");
            long startTime = System.currentTimeMillis();
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
            long endTime = System.currentTimeMillis();
            logger.info("Temps pris pour importNutrientFoods: {} ms", (endTime - startTime));
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
    public static class MeasureCsv {
        Long MeasureID;
        String MeasureDescription;
        String MeasureDescriptionF;
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
    public static class ConversionFactorCsv {
        Long FoodID;
        Long MeasureID;
        Float ConversionFactorValue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientCsv {
        Long NutrientID;
        Long NutrientGroupID;
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
    public static class NutrientGroupCsv {
        Long NutrientGroupID;
        String NutrientGroupName;
        String NutrientGroupNameFr;
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
