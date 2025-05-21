import { Component } from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet name="header"></router-outlet>
    <div class="is-flex">
      <router-outlet name="aside"></router-outlet>
      <div class="container">
        <p> Hello World from the app component</p>
        <router-outlet name="primary"></router-outlet>
      </div>

    </div>

  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.navigate([{outlets: { header: 'HeaderComponent'}}]);
  }

  title = 'Angular';
}
