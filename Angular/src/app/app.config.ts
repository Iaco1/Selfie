import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';


export const routes: Routes = [
  {path: 'HomepageComponent', component: HomepageComponent},
  {path: 'LoginComponent', component: LoginComponent}
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
