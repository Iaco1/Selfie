import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from '../services/user.service';

@Component({
	selector: 'app-sidebar',
	imports: [],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
	constructor(private router: Router, protected userService: UserService) {
	}
	navigateToTimemachine(){
		this.router.navigate(['/TimemachineComponent']);
	}

	navigateToCalendar(){
		this.router.navigate(['/CalendarComponent']);
	}

	navigateToAccountsettings(){
		this.router.navigate(['/AccountsettingsComponent']);
	}

	navigateToPomodoro(){
		this.router.navigate(['/PomodoroComponent']);
	}

	navigateToNotes(){
		this.router.navigate(['/SearchNotesComponent']);
	}
	navigateToListActivities() {
		this.router.navigate(['/ListActivitiesComponent']);
	}
}
