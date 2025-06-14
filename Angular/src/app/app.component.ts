import { Component } from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  template: `
    <router-outlet name="header"></router-outlet>
    <div class="is-flex">
      <router-outlet name="aside"></router-outlet>
      <div class="container">
        <router-outlet name="primary"></router-outlet>
      </div>
    </div>
    <router-outlet name="footer"></router-outlet>

  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.navigate([{outlets: { header: 'HeaderComponent'}}]);
  }

  title = 'Selfie';

}
