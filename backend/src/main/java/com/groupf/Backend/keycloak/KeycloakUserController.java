package com.groupf.Backend.keycloak;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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
}
