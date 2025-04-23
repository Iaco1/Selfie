import { Component } from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import {TimemachineComponent} from './timemachine/timemachine.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimemachineComponent],
  template: `
    <router-outlet name="header"></router-outlet>
    <p> Hello World from the app component</p>
    <router-outlet name="primary"></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.navigate([{outlets: { header: 'HeaderComponent'}}]);
  }

  title = 'Angular';
}
