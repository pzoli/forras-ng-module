import { Injectable } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import axios, {AxiosInstance} from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  axiosInstance: AxiosInstance;

  constructor(public readonly keycloak: KeycloakService) {
    this.axiosInstance = axios.create({})
  }

  async getInstance(): Promise<AxiosInstance> {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${await this.keycloak.getToken()}`
    return this.axiosInstance;
  }
}
