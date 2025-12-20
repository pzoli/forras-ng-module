import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {HttpClientService} from '../../services/http-client.service';
import { MediaInfo, MediaInfoService } from '../../services/mediainfo.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-capture-message',
  templateUrl: './capture-message.component.html',
  styleUrl: './capture-message.component.css'
})
export class CaptureMessageComponent implements OnDestroy {

  private mimeCodec = 'video/webm';
  private mediaRecorder!: MediaRecorder;

  @ViewChild("videoLive")
  videoLive!: ElementRef;

  @ViewChild("videoPlayback")
  videoPlayback!: ElementRef;
   
  public fileName : String = ''

  public recordMode = false
  public isLastChunk = false
  public pastDate!: Date;
  public videoDuration = "00:00";

  public mediaInfos: Promise<MediaInfo[]> = Promise.resolve([]);

  public timeRefreshInterval:ReturnType<typeof setInterval> | undefined;

  constructor(public mediaInfoService: MediaInfoService, public httpClient: HttpClientService) {
    this.mediaInfos = this.getVideoInfoList();
  }

  public get playbackViewDisplay(): string {
    return this.recordMode || this.fileName == "" ? 'none' : 'block';
  }

  public getTimeDelta(): string {
    let now = new Date();
    let delta = Math.floor((now.getTime() - this.pastDate.getTime()) / 1000);
    if (delta < 60) {
      return `00:${delta < 10 ? '0' + delta : delta}`;
    } else if (delta < 3600) {
      let minutes = Math.floor(delta / 60);
      let seconds = delta % 60;
      return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else if (delta < 86400) {
      let hours = Math.floor(delta / 3600);
      let minutes = Math.floor((delta % 3600) / 60);
      let seconds = delta % 60;
      return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
      return "00:00:00"
    }
  }

  async initStream(){
    return navigator.mediaDevices.getUserMedia({ // Androidon a mediaDevice csak https-en működik
      video: true,
      audio: true,
    })
  }

  public setFileName(fileName: String) {
    this.fileName = fileName
  }

  async deleteVideo(id: number) {
    await this.mediaInfoService.removeMediaInfo(id)
    this.mediaInfos = this.getVideoInfoList()
  }

  async getVideoInfoList() : Promise<MediaInfo[]> {
    let profile = await this.httpClient.keycloak.loadUserProfile()
    let result = await this.mediaInfoService.getMediaInfos(profile.id!!)
    return result
  }

  async startVideo() {
    this.isLastChunk = false
    this.recordMode = true
    let profile = await this.httpClient.keycloak.loadUserProfile();
    this.fileName = await this.getFileName();
    if (!MediaRecorder.isTypeSupported(this.mimeCodec)) { // <2>
      console.warn('video/webm is not supported')
      alert('Sajnáljuk, de az Ön böngészője nem támogatja a video/webm formátumot.')
    } else {
      try {
        let stream = await this.initStream()
        this.videoLive.nativeElement.srcObject = stream
        this.videoLive.nativeElement.muted = true
        this.pastDate = new Date();
        this.mediaRecorder = new MediaRecorder(stream)
        let countUploadChunk = 0
        let self = this
        this.mediaRecorder.ondataavailable = async (data) => {
          if (data.data.size > 0) {
            let profile = await this.httpClient.keycloak.loadUserProfile()
            console.log(`Uploading chunk #${countUploadChunk} for user ${profile.id}`)
            countUploadChunk++
            await this.sendFile(data.data, self.fileName)
          }
        }
        this.mediaRecorder.start(2000)
        this.timeRefreshInterval = setInterval(() => {
          this.videoDuration = this.getTimeDelta();
        }, 1000)
      } catch (e) {
        alert(`Hiba történt a kamera vagy mikrofon elindításakor. ${e}`)
        return
      }
    }
  }

  async getFileName() {
    return (await (await this.httpClient.getInstance()).get(`/api/video/filename`)).data as String
  }

  async stopVideo() {
    this.isLastChunk = true
    this.mediaRecorder.stop()
    let stream = this.videoLive.nativeElement.srcObject as MediaStream
    let tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    this.videoLive.nativeElement.srcObject = null
    this.pastDate = new Date();
    setTimeout(async () => {
      await this.loadVideo()
      this.recordMode = false
      this.mediaInfos = this.getVideoInfoList()
    }, 2000);
  }

  async loadVideo(fileName: String = this.fileName) {
    try {
      let profile = await this.httpClient.keycloak.loadUserProfile();
      const response = (await (await this.httpClient.getInstance()).get(`/api/video/stream?origin=${fileName + ".webm"}&userid=${profile.id}`, { responseType: 'blob' })).data
      const videoBlob = new Blob([response], { type: this.mimeCodec })
      const videoUrl = URL.createObjectURL(videoBlob)
      this.videoPlayback.nativeElement.src = videoUrl
    } catch (e) {
      alert(`Hiba történt a videó betöltésekor. ${e}`)
    }
  }

  async sendFile(file: Blob, origin: String) {
    if (file.size != 0) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('origin', origin.toString());
      formData.append('islast', this.isLastChunk.toString());
      try {
        (await this.httpClient.getInstance()).put('/api/video/upload', formData).then((res) => {
          console.log(res)
        }).catch((err) => {
          this.mediaRecorder.stop()
          alert(`Hiba történt a videó feltöltésekor. ${err}`)
        });
      } catch (e) {
        alert(`Hiba történt a videó feltöltésekor. ${e}`)
      }

   }
  }
  ngOnDestroy() {
    if (this.timeRefreshInterval)
      clearInterval(this.timeRefreshInterval)
  }
}
