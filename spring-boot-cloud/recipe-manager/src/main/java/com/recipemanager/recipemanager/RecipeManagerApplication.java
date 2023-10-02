package com.recipemanager.recipemanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import utils.AuditorAwareImpl;
import utils.JwtTokenProvider;

@Import({AuditorAwareImpl.class, JwtTokenProvider.class})
@EnableJpaAuditing
@EnableFeignClients
@SpringBootApplication
public class RecipeManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeManagerApplication.class, args);
    }

}
