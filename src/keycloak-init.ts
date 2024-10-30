import Keycloak from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return (): Promise<boolean> =>
    keycloak.init({
      config: {
        url: 'https://exprog.hu:9443/',
        realm: 'infokristaly',
        clientId: 'public-client',
      },
      initOptions: {
        onLoad: 'login-required',
      },
    });
}