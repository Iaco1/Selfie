import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {
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

  logout(){
    this.router.navigate([{ outlets: { header: 'HeaderComponent', asideLeft: null, primary: null, asideRight: null, footer: null }}]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('saveStateUrl');
  }

}

