import {Component, ElementRef, ViewChild} from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  providers: [AuthService],
  template: `
    <router-outlet name="header"></router-outlet>
    <div class="is-flex">
      <router-outlet name="asideLeft"></router-outlet>
      <div class="container">
        <router-outlet name="primary"></router-outlet>
      </div>
      <router-outlet name="asideRight"></router-outlet>
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
