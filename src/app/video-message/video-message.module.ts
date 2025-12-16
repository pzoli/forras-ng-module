import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureMessageComponent } from './capture-message/capture-message.component';
import { PlaybackMessageComponent } from './playback-message/playback-message.component';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    CaptureMessageComponent,
    PlaybackMessageComponent
  ],
  imports: [
    CommonModule, ButtonModule
  ],
  exports: [CaptureMessageComponent, PlaybackMessageComponent]
})
export class VideoMessageModule { }
