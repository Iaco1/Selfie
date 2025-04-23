import { Component } from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalendarComponent],
  template: `
    <router-outlet name="header"></router-outlet>
    <p> Hello World from the app component</p>
    <router-outlet name="primary"></router-outlet>
    <calendar/>
  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.navigate([{outlets: { header: 'HeaderComponent'}}]);
  }

  title = 'Angular';
}
