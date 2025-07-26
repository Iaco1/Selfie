import { Component } from '@angular/core';
//import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

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
  constructor(private router: Router ) {}
  navigateToHomePage(){
    this.router.navigate(['/HomepageComponent']);
  }
  navigateToLoginComponent(){
    this.router.navigate(['/LoginComponent']);
  }
  navigateToSignupComponent(){
    this.router.navigate(['/SignupComponent']);
  }
  toggleNavbarBurger(navbarBurger: HTMLAnchorElement){
    if (navbarBurger.classList.contains('is-active')) {
      navbarBurger.classList.remove('is-active');
    }else{
      navbarBurger.classList.add('is-active');
    }
    this.navbarMenuOpen = !this.navbarMenuOpen;
  }
  requestPermission(){
    Notification.requestPermission().then(result => {
      console.log("pemission request result: ", result);
    }).catch(error => { console.log("permission request error: ", error);})
    new Notification("Notification test with NotificationAPI");

  }
}
