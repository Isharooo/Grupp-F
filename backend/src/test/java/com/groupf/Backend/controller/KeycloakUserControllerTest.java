package com.groupf.Backend.controller;

import com.groupf.Backend.model.UserRegistrationRecord;
import com.groupf.Backend.service.KeycloakUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KeycloakUserController.class)
class KeycloakUserControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    @MockitoBean KeycloakUserService keycloakUserService;

    private JwtRequestPostProcessor jwtAdmin;
    private UserRegistrationRecord record;
    private UserRepresentation userRep;

    @BeforeEach
    void setUp() {
        jwtAdmin = jwt().authorities(new SimpleGrantedAuthority("ROLE_admin"));

        record = new UserRegistrationRecord("testuser", "password");

        userRep = new UserRepresentation();
        userRep.setId("123");
        userRep.setUsername("testuser");
    }

    @Test
    void createUser_returns200AndUserRecord() throws Exception {
        when(keycloakUserService.createUser(any(UserRegistrationRecord.class))).thenReturn(record);

        mockMvc.perform(post("/api/users")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void createUser_duplicateUser_returns409() throws Exception {
        when(keycloakUserService.createUser(any(UserRegistrationRecord.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.CONFLICT, "User already exists"));

        mockMvc.perform(post("/api/users")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isConflict());
    }

    @Test
    void getUser_returns200AndUserRepresentation() throws Exception {
        when(keycloakUserService.getUserById(anyString())).thenReturn(userRep);

        mockMvc.perform(get("/api/users")
                        .with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void getUser_notFound_returns404() throws Exception {
        when(keycloakUserService.getUserById(anyString()))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        mockMvc.perform(get("/api/users")
                        .with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllUsers_returns200AndList() throws Exception {
        when(keycloakUserService.getAllUsers()).thenReturn(List.of(userRep));

        mockMvc.perform(get("/api/users/all")
                        .with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void getAllUsers_empty_returns200AndEmptyList() throws Exception {
        when(keycloakUserService.getAllUsers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/users/all")
                        .with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllUsers_serviceError_returns500() throws Exception {
        when(keycloakUserService.getAllUsers())
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Service error"));

        mockMvc.perform(get("/api/users/all")
                        .with(jwtAdmin))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void deleteUserByID_returns200() throws Exception {
        mockMvc.perform(delete("/api/users/123")
                        .with(jwtAdmin))
                .andExpect(status().isOk());

        verify(keycloakUserService).deleteUser("123");
    }

    @Test
    void deleteUserByID_notFound_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
                .when(keycloakUserService).deleteUser("123");

        mockMvc.perform(delete("/api/users/123")
                        .with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUserByID_serviceError_returns500() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Deletion failed"))
                .when(keycloakUserService).deleteUser("123");

        mockMvc.perform(delete("/api/users/123")
                        .with(jwtAdmin))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void updateUsername_returns200() throws Exception {
        Map<String, String> request = Map.of("username", "newusername");

        mockMvc.perform(put("/api/users/123/username")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(keycloakUserService).updateUsername("123", "newusername");
    }



    @Test
    void updateUsername_notFound_returns404() throws Exception {
        Map<String, String> request = Map.of("username", "newusername");

        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
                .when(keycloakUserService).updateUsername("123", "newusername");

        mockMvc.perform(put("/api/users/123/username")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void resetPassword_returns200() throws Exception {
        Map<String, Object> request = Map.of(
                "value", "newPassword123",
                "temporary", true
        );

        mockMvc.perform(put("/api/users/123/reset-password")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(keycloakUserService).resetPassword("123", "newPassword123", true);
    }


    @Test
    void resetPassword_notFound_returns404() throws Exception {
        Map<String, Object> request = Map.of(
                "value", "newPassword123",
                "temporary", true
        );

        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
                .when(keycloakUserService).resetPassword("123", "newPassword123", true);

        mockMvc.perform(put("/api/users/123/reset-password")
                        .with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}