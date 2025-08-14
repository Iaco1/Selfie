import {Component} from '@angular/core';
import {RouterOutlet, Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {HostListener} from '@angular/core';
import {PomodoroService} from './services/pomodoro.service';
import {NotificationContainerComponent} from './notification-container/notification-container.component';
import {NotificationService} from './services/notification.service';
import {EventService} from './services/event.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, NotificationContainerComponent],
  providers: [AuthService, UserService, PomodoroService, NotificationService, EventService],
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

    <app-notification-container></app-notification-container>

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
