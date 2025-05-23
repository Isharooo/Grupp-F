package com.groupf.Backend.config1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true) // Enables @RolesAllowed, etc.
public class SecurityConfig {

    // Hardcoded issuer URI for clarity and to avoid properties file issues
    private final String issuerUri = "http://localhost:8080/realms/grfood-realm";
    
    // JWKS URI should use the internal Docker network name for backend-to-Keycloak communication
    private final String jwksUri = "http://keycloak:8080/realms/grfood-realm/protocol/openid-connect/certs";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Secure all /api/** endpoints. Adjust as needed.
                .requestMatchers("/api/**").authenticated()
                // Allow unauthenticated access to other endpoints if needed (e.g., actuator health)
                .requestMatchers("/actuator/health").permitAll() 
                .anyRequest().permitAll() // Default: permit all if not specified above. Or change to .denyAll() or .authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );
        return http.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        // We will build the decoder manually for full control
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwksUri).build();

        // Validator for the issuer claim
        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(issuerUri);
        
        // Example: Validator for the audience claim (if your tokens have an 'aud' claim)
        // String expectedAudience = "account"; // Or whatever your backend's client ID/audience is
        // OAuth2TokenValidator<Jwt> audienceValidator = new JwtClaimValidator<Object>("aud", aud -> {
        //     if (aud instanceof String) {
        //         return ((String) aud).equals(expectedAudience);
        //     }
        //     if (aud instanceof java.util.List) {
        //         return ((java.util.List<?>) aud).contains(expectedAudience);
        //     }
        //     return false;
        // });

        // Combine validators
        // If using audience validator: new DelegatingOAuth2TokenValidator<>(issuerValidator, audienceValidator)
        OAuth2TokenValidator<Jwt> delegatingValidator = new DelegatingOAuth2TokenValidator<>(issuerValidator);
        
        jwtDecoder.setJwtValidator(delegatingValidator);

        return jwtDecoder;
    }
}
