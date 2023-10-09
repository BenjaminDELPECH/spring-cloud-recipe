package com.recipemanager.foodnutrients;

import com.edelpech.sharedlibrarystarter.GeneralSecurityConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@Import(GeneralSecurityConfiguration.class)
@SpringBootApplication
public class FoodNutrientsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodNutrientsApplication.class, args);
	}

}
