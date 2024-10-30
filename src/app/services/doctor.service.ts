import { Injectable } from '@angular/core';
import axios from 'axios';
import {KeycloakService} from 'keycloak-angular';
import {HttpClient} from '@angular/common/http';
import {HttpClientService} from './http-client.service';

export interface Doctor {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(public httpClient: HttpClientService) {

  }

  public async getDoctors(): Promise<Doctor[]> {
    const result = (await this.httpClient.getInstance()).get("/api/doctor",{}).then(res => { return res.data});
    return await result;
  }

  public async saveDoctor(currentDoctor: Doctor | null): Promise<Doctor> {
    const config = { headers: {'Content-Type': 'application/json'} };
    const result = (await this.httpClient.getInstance()).post("/api/doctor",currentDoctor,config).then(res => { return res.data});
    return await result;
  }

  public async updateDoctor(currentDoctor: Doctor | null): Promise<Doctor> {
    const config = { headers: {'Content-Type': 'application/json'} };
    const result = (await this.httpClient.getInstance()).put("/api/doctor",currentDoctor,config).then(res => { return res.data});
    return await result;
  }

  public async removeDoctor(id: number): Promise<unknown> {
    const config = { headers: {'Content-Type': 'application/json'} };
    const result = (await this.httpClient.getInstance()).delete("/api/doctor/"+id, config).then(res => { return res.data});
    return await result
  }
}
