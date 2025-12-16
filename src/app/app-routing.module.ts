import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeycloakGuard } from './auth/keycloak.guard';
import {DoctorComponent} from './doctor/doctor.component';
import {HomeComponent} from './home/home.component';
import {VideoMessageModule} from './video-message/video-message.module';
import {CaptureMessageComponent} from './video-message/capture-message/capture-message.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [KeycloakGuard]},
  { path: 'doctors', component: DoctorComponent },
  { path: 'video-message/capture-message', component: CaptureMessageComponent},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
