import { Component } from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet name="header"></router-outlet>
    <router-outlet name="primary"></router-outlet>
    <router-outlet name="aside"></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.navigate([{outlets: { header: 'HeaderComponent'}}]);
  }

  title = 'Angular';
}
