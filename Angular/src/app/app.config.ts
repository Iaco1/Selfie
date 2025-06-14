import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {SignupComponent} from './signup/signup.component';
import {SuccessComponent} from './success/success.component';
import {HeaderComponent} from './header/header.component';
import {HomeheaderComponent} from './homeheader/homeheader.component';
import {SidebarComponent} from './sidebar/sidebar.component';

import {TimemachineComponent} from './calendar/timemachine/timemachine.component';
import {CalendarComponent} from './calendar/calendar.component';
import {AccountsettingsComponent} from './accountsettings/accountsettings.component';
import {PomodoroComponent} from './pomodoro/pomodoro.component';
import {SearchNotesComponent} from './searchnotes/search-notes.component';

export const routes: Routes = [
  {path: 'HomepageComponent', component: HomepageComponent, outlet: 'primary'},
  {path: 'LoginComponent', component: LoginComponent, outlet: 'primary'},
  {path: 'SignupComponent', component: SignupComponent, outlet: 'primary'},
  {path: 'SuccessComponent', component: SuccessComponent, outlet: 'primary'},
  {path: 'HeaderComponent', component: HeaderComponent, outlet: 'header'},
  {path: 'HomeheaderComponent', component: HomeheaderComponent, outlet: 'header'},
  {path: 'SidebarComponent', component: SidebarComponent, outlet: 'aside'},
  {path: 'TimemachineComponent', component: TimemachineComponent, outlet: 'footer'},
  {path: 'CalendarComponent', component: CalendarComponent, outlet: 'primary'},
  {path: 'AccountsettingsComponent', component: AccountsettingsComponent, outlet: 'primary'},
  {path: 'PomodoroComponent', component: PomodoroComponent, outlet: 'primary'},
  {path: 'SearchNotesComponent', component: SearchNotesComponent, outlet: 'primary'},
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
