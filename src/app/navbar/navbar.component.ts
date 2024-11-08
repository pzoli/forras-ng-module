import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import axios from 'axios';
import {KeycloakProfile} from 'keycloak-js';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  public items:MenuItem[] = [];
  profile: KeycloakProfile | null = null;

  constructor(public readonly keycloak: KeycloakService, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadMenu(event.lang)
    });
  }

  public async ngOnInit() {
    if (this.keycloak.isLoggedIn()) {
      this.profile = await this.keycloak.loadUserProfile();
      if (this.profile.attributes) {
        this.translate.use(this.profile.attributes['language']?this.profile.attributes['language'].toString():'')
      }
    }
  }

  public logout() {
    this.keycloak.logout();
  }

  loadMenu(lang:string): void {
    const self = this
    axios.get(`assets/i18n/menu.${lang}.json`).then(res => {
      self.items = res.data.items
    });
  }
}
