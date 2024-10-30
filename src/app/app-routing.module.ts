import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { KeycloakGuard } from './auth/keycloak.guard';
import {DoctorComponent} from './doctor/doctor.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [KeycloakGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'doctors', component: DoctorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
