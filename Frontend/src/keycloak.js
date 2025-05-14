import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'grfood-realm',
    clientId: 'grfood-frontend',
});

export default keycloak;