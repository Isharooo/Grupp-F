package com.groupf.Backend.service;

import com.groupf.Backend.config.KeycloakProperties;
import com.groupf.Backend.model.UserRegistrationRecord;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class KeycloakUserService {

    private Keycloak keycloak;
    private final KeycloakProperties props;

    @Autowired
    public KeycloakUserService(Keycloak keycloak, KeycloakProperties props) {
        this.keycloak = keycloak;
        this.props = props;
    }

    public UserRegistrationRecord createUser(UserRegistrationRecord userRegistrationRecord) {

        UserRepresentation user = new UserRepresentation();
        user.setUsername(userRegistrationRecord.username());
        user.setEnabled(true);

        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setValue(userRegistrationRecord.password());
        cred.setTemporary(false);
        cred.setType(CredentialRepresentation.PASSWORD);

        List<CredentialRepresentation> credList = new ArrayList<>();
        credList.add(cred);

        user.setCredentials(credList);

        UsersResource usersResource = getUsersResource();

        Response response = usersResource.create(user);

        if (Objects.equals(201, response.getStatus())) {
            return userRegistrationRecord;
        }

      //  response.readEntity()

        return null;
    }

    private UsersResource getUsersResource() {
        RealmResource realm = keycloak.realm(props.getRealm());
        return realm.users();
    }

    public UserRepresentation getUserById(String userId) {

        return getUsersResource().get(userId).toRepresentation();
    }

    public List<UserRepresentation> getAllUsers() {
        List<UserRepresentation> users = new ArrayList<>();
        UsersResource usersResource = getUsersResource();
        return usersResource.list();
    }

    public void deleteUser(String userId) {
        getUsersResource().delete(userId);
    }

    public void updateUsername(String userId, String username) {
        UserRepresentation user = getUserById(userId);
        user.setUsername(username);
        getUsersResource().get(userId).update(user);
    }

    public void resetPassword(String userId, String password, boolean temporary) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(temporary);

        getUsersResource().get(userId).resetPassword(credential);
    }

}
