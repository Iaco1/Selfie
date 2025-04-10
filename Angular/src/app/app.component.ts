import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet, Router} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, HeaderComponent],
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
