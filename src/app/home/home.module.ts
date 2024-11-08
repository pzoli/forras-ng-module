import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslatePipe} from '@ngx-translate/core';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, FormsModule, ButtonModule, DialogModule, BrowserAnimationsModule, TranslatePipe, DropdownModule, ButtonModule, FormsModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
