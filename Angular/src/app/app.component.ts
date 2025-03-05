import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {LoginComponent} from './login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent],
  template: `
    <p> Hello World from the app component</p>
    <a routerLink="/LoginComponent">Login</a>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Angular';
}
