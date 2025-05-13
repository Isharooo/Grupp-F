package com.groupf.Backend.keycloak;

public record UserRegistrationRecord(String username, String firstName, String lastName, String email, String password) {
}
