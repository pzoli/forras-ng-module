import { Component } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  items:MenuItem[] = [
      {
        label: 'Home',
        url: '/home'
      },
      {
        label: 'Doctors',
        url: '/doctors',
      }
  ]
}
