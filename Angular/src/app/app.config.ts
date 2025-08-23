import { ApplicationConfig, NgModule, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
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
import {SearchNotesComponent} from './notes/search-notes/search-notes.component';
import {EditorNotesComponent} from './notes/editor-notes/editor-notes.component';
import { ListActivitiesComponent } from './list-activities/list-activities.component';
import { provideServiceWorker } from '@angular/service-worker';
import { EditorEventComponent } from './events/editor-event/editor-event.component';

export const routes: Routes = [
	{path: 'HomepageComponent', component: HomepageComponent, outlet: 'primary'},
	{path: 'LoginComponent', component: LoginComponent, outlet: 'primary'},
	{path: 'SignupComponent', component: SignupComponent, outlet: 'primary'},
	{path: 'SuccessComponent', component: SuccessComponent, outlet: 'primary'},
	{path: 'HeaderComponent', component: HeaderComponent, outlet: 'header'},
	{path: 'HomeheaderComponent', component: HomeheaderComponent, outlet: 'header'},
	{path: 'SidebarComponent', component: SidebarComponent, outlet: 'asideLeft'},
	{path: 'TimemachineComponent', component: TimemachineComponent, outlet: 'footer'},
	{path: 'CalendarComponent', component: CalendarComponent, outlet: 'primary'},
	{path: 'AccountsettingsComponent', component: AccountsettingsComponent, outlet: 'primary'},
	{path: 'PomodoroComponent', component: PomodoroComponent, outlet: 'primary'},
	{path: 'ListActivitiesComponent', component: ListActivitiesComponent, outlet: 'primary'},
	//routers for notes
	{path: 'SearchNotesComponent', component: SearchNotesComponent, outlet: 'primary'},
	{ path: 'editor-note', component: EditorNotesComponent },		// For creating a new note
	{ path: 'editor-note/:id', component: EditorNotesComponent },	// For editing an existing note
	//routes for events
	{ path: 'calendar', component: CalendarComponent},	// For going back to the right place
	{ path: 'editor-event', component: EditorEventComponent },		// For creating a new event
	{ path: 'editor-event/:id', component: EditorEventComponent },	// For editing an existing event
	{ path: 'pomodoro', component: PomodoroComponent}, // let me start a pomodoro
	// ???
	{ path: '', component: HeaderComponent, outlet: 'header' },
];

export const appConfig: ApplicationConfig = {
	providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: true,
            registrationStrategy: 'registerWhenStable:30000'
          })]
};

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
