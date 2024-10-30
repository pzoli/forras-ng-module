import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from './doctor.component';
import { TableModule } from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    DoctorComponent
  ],
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule, BrowserAnimationsModule, InputTextModule, FormsModule, ConfirmDialogModule, ToastModule
  ],
  exports: [
    DoctorComponent
  ]
})
export class DoctorModule { }
