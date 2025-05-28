package com.groupf.Backend.service;

import com.groupf.Backend.config.KeycloakProperties;
import com.groupf.Backend.model.UserRegistrationRecord;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KeycloakUserServiceTest {

    @Mock
    private Keycloak keycloak;

    @Mock
    private KeycloakProperties props;

    @Mock
    private RealmResource realmResource;

    @Mock
    private UsersResource usersResource;

    @Mock
    private UserResource userResource;

    @InjectMocks
    private KeycloakUserService service;

    private final String realmName = "test-realm";
    private final String userId = "123";
    private final String username = "testuser";
    private final String password = "testpass";

    @BeforeEach
    void setup() {
        when(props.getRealm()).thenReturn(realmName);
        when(keycloak.realm(realmName)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
    }

    @Test
    void testCreateUser_Success() {
        UserRegistrationRecord record = new UserRegistrationRecord(username, password);
        Response response = mock(Response.class);

        when(usersResource.create(any(UserRepresentation.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(201);

        var result = service.createUser(record);
        assertNotNull(result);
        assertEquals(username, result.username());
        assertEquals(password, result.password());
    }

    @Test
    void testCreateUser_Failure() {
        UserRegistrationRecord record = new UserRegistrationRecord(username, password);
        Response response = mock(Response.class);

        when(usersResource.create(any(UserRepresentation.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(400);

        var result = service.createUser(record);
        assertNull(result);
    }

    @Test
    void testGetUserById() {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(username);

        when(usersResource.get(userId)).thenReturn(userResource);
        when(userResource.toRepresentation()).thenReturn(userRepresentation);

        var result = service.getUserById(userId);
        assertEquals(username, result.getUsername());
    }

    @Test
    void testGetAllUsers() {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);

        when(usersResource.list()).thenReturn(List.of(user));

        var result = service.getAllUsers();
        assertEquals(1, result.size());
        assertEquals(username, result.get(0).getUsername());
    }

    @Test
    void testDeleteUser() {
        service.deleteUser(userId);
        verify(usersResource).delete(userId);
    }

    @Test
    void testUpdateUsername() {
        UserRepresentation user = new UserRepresentation();
        user.setUsername("old");

        when(usersResource.get(userId)).thenReturn(userResource);
        when(userResource.toRepresentation()).thenReturn(user);

        service.updateUsername(userId, "newname");

        verify(userResource).update(argThat(u -> "newname".equals(u.getUsername())));
    }

    @Test
    void testResetPassword() {
        when(usersResource.get(userId)).thenReturn(userResource);

        service.resetPassword(userId, "newpass", false);

        verify(userResource).resetPassword(argThat(cred ->
                CredentialRepresentation.PASSWORD.equals(cred.getType())
                        && "newpass".equals(cred.getValue())
                        && !cred.isTemporary()));
    }
}
