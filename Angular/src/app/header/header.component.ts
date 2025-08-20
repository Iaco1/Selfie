import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../services/notification.service';

/**
 * header displayed when not logged in yet
 */
@Component({
  selector: 'app-header',
  imports: [
//    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navbarMenuOpen = false;

  constructor(private router: Router, private notificationService: NotificationService) {}

  // routing methods
  navigateToHomePage(){
    this.router.navigate(['/HomepageComponent']);
  }
  navigateToLoginComponent(){
    this.router.navigate(['/LoginComponent']);
  }
  navigateToSignupComponent(){
    this.router.navigate(['/SignupComponent']);
  }

  /**
   * toggles a visual effect for the navbarBurger when clicked
   */
  toggleNavbarBurger(navbarBurger: HTMLAnchorElement){
    if (navbarBurger.classList.contains('is-active')) {
      navbarBurger.classList.remove('is-active');
    }else{
      navbarBurger.classList.add('is-active');
    }
    this.navbarMenuOpen = !this.navbarMenuOpen;
  }

  /**
   * emits a notification native to the user's OS upon clicking the notification button
   */
  notify(){
    this.notificationService.runOnSnooze();
    this.notificationService.showNotification("i'm sending this from...", "the header component", true, 1);
  }
}
