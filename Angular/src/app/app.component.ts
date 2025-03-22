import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, HeaderComponent],
  template: `
    <app-header></app-header>
    <p> Hello World from the app component</p>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Angular';
}
