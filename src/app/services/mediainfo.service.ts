import { Injectable } from '@angular/core';
import axios from 'axios';
import {KeycloakService} from 'keycloak-angular';
import {HttpClient} from '@angular/common/http';
import {HttpClientService} from './http-client.service';

export interface MediaInfo {
  id: number;
  fileName: string;
  closeDate: Date;
  systemUserSub: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaInfoService {

  constructor(public httpClient: HttpClientService) {

  }

  public async getMediaInfos(sub: string): Promise<MediaInfo[]> {
    const result = (await this.httpClient.getInstance()).get("/api/video/mediainfos?sub="+sub,{}).then(res => { return res.data});
    const aresult = await result as MediaInfo[];
    return aresult;
  }

  public async removeMediaInfo(id: number): Promise<unknown> {
    const config = { headers: {'Content-Type': 'application/json'} };
    const result = (await this.httpClient.getInstance()).delete("/api/video?id="+id, config).then(res => { return res.data});
    return await result
  }
}
