import {Component, computed, effect, OnInit, signal} from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  profile: KeycloakProfile | null = null;
  private isLoggedIn: boolean = false;

  constructor(public readonly keycloak: KeycloakService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.profile = await this.keycloak.loadUserProfile();
    }
  }

  public logout() {
    this.keycloak.logout();
  }

}
