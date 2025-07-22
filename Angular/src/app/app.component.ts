import {Component} from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {HostListener} from '@angular/core';
import {PomodoroService} from './services/pomodoro.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  providers: [AuthService, UserService, PomodoroService],
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

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    localStorage.setItem("saveStateUrl", this.router.url);
  }

  ngOnInit(){
    const url = localStorage.getItem("saveStateUrl");
    if(url == null || url == '/') return;
    this.router.navigateByUrl(url!);
  }

}
