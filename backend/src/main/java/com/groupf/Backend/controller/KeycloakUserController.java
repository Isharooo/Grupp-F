package com.groupf.Backend.controller;

import com.groupf.Backend.service.KeycloakUserService;
import com.groupf.Backend.model.UserRegistrationRecord;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class KeycloakUserController {

    private final KeycloakUserService keycloakUserService;

    @Autowired
    public KeycloakUserController(KeycloakUserService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public UserRegistrationRecord createUser(@RequestBody UserRegistrationRecord record) {
        return keycloakUserService.createUser(record);
    }

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public UserRepresentation getUser(Principal principal) {
        return keycloakUserService.getUserById(principal.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('admin')")
    public List<UserRepresentation> getAllUsers() {
        return keycloakUserService.getAllUsers();
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('admin')")
    public void deleteUserByID(@PathVariable String userId) {
        keycloakUserService.deleteUser(userId);
    }

    @PutMapping("/{userId}/username")
    @PreAuthorize("hasRole('admin')")
    public void updateUsername(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        keycloakUserService.updateUsername(userId, username);
    }

    @PutMapping("/{userId}/reset-password")
    @PreAuthorize("hasRole('admin')")
    public void resetPassword(@PathVariable String userId, @RequestBody Map<String, Object> request) {
        String password = (String) request.get("value");
        boolean temporary = (boolean) request.get("temporary");
        keycloakUserService.resetPassword(userId, password, temporary);
    }

}
