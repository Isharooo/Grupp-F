package com.groupf.Backend.keycloak;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class KeycloakUserController {

    private final KeycloakUserService keycloakUserService;

    @Autowired
    public KeycloakUserController(KeycloakUserService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    @PostMapping
    public UserRegistrationRecord createUser(@RequestBody UserRegistrationRecord record) {
        return keycloakUserService.createUser(record);
    }

    @GetMapping
    public UserRepresentation getUser(Principal principal) {
        return keycloakUserService.getUserById(principal.getName());
    }

    @GetMapping("/all")
    public List<UserRepresentation> getAllUsers() {
        return keycloakUserService.getAllUsers();
    }

    @DeleteMapping("/{userId}")
    public void deleteUserByID(@PathVariable String userId) {
        keycloakUserService.deleteUser(userId);
    }

    @PutMapping("/{userId}/username")
    public void updateUsername(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        keycloakUserService.updateUsername(userId, username);
    }

    @PutMapping("/{userId}/reset-password")
    public void resetPassword(@PathVariable String userId, @RequestBody Map<String, Object> request) {
        String password = (String) request.get("value");
        boolean temporary = (boolean) request.get("temporary");
        keycloakUserService.resetPassword(userId, password, temporary);
    }

}
