package com.recipemanager.recipemanager;

import com.edelpech.sharedlibrarystarter.GeneralSecurityConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Import;

@Import(GeneralSecurityConfiguration.class)
@EnableFeignClients
@SpringBootApplication
public class RecipeManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeManagerApplication.class, args);
    }

}
