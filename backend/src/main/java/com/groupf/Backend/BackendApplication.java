package com.groupf.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerJwtAutoConfiguration;

/**
 * Main entry point for the Spring Boot backend application.
 * Initializes and launches the application using SpringApplication.
 */
@SpringBootApplication(exclude = { OAuth2ResourceServerJwtAutoConfiguration.class })
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
