import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {SignupComponent} from './signup/signup.component';
import {SuccessComponent} from './success/success.component';
import {HeaderComponent} from './header/header.component';
import {HomeheaderComponent} from './homeheader/homeheader.component';


export const routes: Routes = [
  {path: 'HomepageComponent', component: HomepageComponent, outlet: 'primary'},
  {path: 'LoginComponent', component: LoginComponent, outlet: 'primary'},
  {path: 'SignupComponent', component: SignupComponent, outlet: 'primary'},
  {path: 'SuccessComponent', component: SuccessComponent, outlet: 'primary'},
  {path: 'HeaderComponent', component: HeaderComponent, outlet: 'header'},
  {path: 'HomeheaderComponent', component: HomeheaderComponent, outlet: 'header'},
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
