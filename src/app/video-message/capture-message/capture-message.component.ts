import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {HttpClientService} from '../../services/http-client.service';
import { MediaInfo, MediaInfoService } from '../../services/mediainfo.service';

@Component({
  selector: 'app-capture-message',
  templateUrl: './capture-message.component.html',
  styleUrl: './capture-message.component.css'
})
export class CaptureMessageComponent implements OnDestroy {

  private mimeCodec = 'video/webm';

  @ViewChild("videoLive")
  videoLive!: ElementRef;

  @ViewChild("videoPlayback")
  videoPlayback!: ElementRef;
   
  public fileName : String = ''

  public recordMode = false

  public mediaInfos: Promise<MediaInfo[]> = Promise.resolve([]);

  registerInterval:ReturnType<typeof setInterval> | undefined

  constructor(public mediaInfoService: MediaInfoService, public httpClient: HttpClientService) {
    this.mediaInfos = this.getVideoInfoList();
  }

  public get playbackViewDisplay(): string {
    return this.recordMode || this.fileName == "" ? 'none' : 'block';
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
        this.registerRecord(stream)
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
    if (this.registerInterval)
      clearInterval(this.registerInterval)
    await (await this.httpClient.getInstance()).put(`/api/video/closemedia?origin=${this.fileName}`)
    let stream = this.videoLive.nativeElement.srcObject as MediaStream
    let tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    this.videoLive.nativeElement.srcObject = null
    await this.loadVideo()
    this.recordMode = false
    this.mediaInfos = this.getVideoInfoList()
  }

  async loadVideo(fileName: String = this.fileName) {
    let profile = await this.httpClient.keycloak.loadUserProfile();
    const response = (await (await this.httpClient.getInstance()).get(`/api/video/stream?origin=${fileName + ".webm"}&userid=${profile.id}`, { responseType: 'blob' })).data
    const videoBlob = new Blob([response], { type: this.mimeCodec })
    const videoUrl = URL.createObjectURL(videoBlob)
    this.videoPlayback.nativeElement.src = videoUrl
  }

  registerRecord(stream: MediaStream) {
    const mediaRecorder = new MediaRecorder(stream)
    let countUploadChunk = 0
    let self = this
    mediaRecorder.ondataavailable = async (data) => {
      let profile = await this.httpClient.keycloak.loadUserProfile()
      console.log(`Uploading chunk #${countUploadChunk} for user ${profile.id}`)
      countUploadChunk++
      this.sendFile(data.data, self.fileName)
    }
    mediaRecorder.start()

    this.registerInterval = setInterval(() => {
      mediaRecorder.requestData()
    }, 2000)
  }

  async sendFile(file: Blob, origin: String) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('origin', origin.toString());
    (await this.httpClient.getInstance()).put('/api/video/upload', formData).then((res) => {
      console.log(res)
    });
  }

  ngOnDestroy() {
    if (this.registerInterval)
      clearInterval(this.registerInterval)
  }
}
