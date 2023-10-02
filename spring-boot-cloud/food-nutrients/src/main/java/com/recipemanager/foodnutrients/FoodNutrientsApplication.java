package com.recipemanager.foodnutrients;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import utils.AuditorAwareImpl;
import utils.JwtTokenProvider;

@Import({AuditorAwareImpl.class, JwtTokenProvider.class})
@EnableJpaAuditing
@SpringBootApplication
public class FoodNutrientsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodNutrientsApplication.class, args);
	}

}
