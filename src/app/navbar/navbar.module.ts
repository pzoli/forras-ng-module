import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MenubarModule } from 'primeng/menubar';
import {Button} from "primeng/button";
import {TranslatePipe} from '@ngx-translate/core';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule, MenubarModule, Button, TranslatePipe
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
