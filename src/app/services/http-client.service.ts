import { Injectable } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
private axiosInstance: AxiosInstance;

  constructor(public readonly keycloak: KeycloakService) {
    this.axiosInstance = axios.create();

    // REQUEST INTERCEPTOR BEÁLLÍTÁSA
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          // 1. Frissítjük a tokent, ha az 30 másodpercen belül lejárna
          // Az updateToken(30) visszatérési értéke egy Promise, ami 
          // akkor is sikeres, ha nem kellett frissíteni (mert még érvényes).
          await this.keycloak.updateToken(30);

          // 2. Lekérjük az aktuális (friss) tokent
          const token = await this.keycloak.getToken();

          // 3. Beállítjuk az Authorization fejlécet az aktuális kéréshez
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          return config;
        } catch (error) {
          // Ha a Refresh Token is lejárt, a felhasználót újra be kell léptetni
          console.error('Nem sikerült frissíteni a tokent, kijelentkezés...', error);
          this.keycloak.login(); 
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Most már nincs szükség a getInstance-ben a manuális fejléc állításra
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
