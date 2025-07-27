import {Component, inject} from '@angular/core';
//import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {SwPush, SwUpdate} from '@angular/service-worker';

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
  private swUpdate = inject(SwUpdate);
  private swPush = inject(SwPush);
  readonly VAPID_PUBLIC_KEY = "BH-EyqqZPrkQVCKY5w0CWkO6X8cu6D9cR31Z-fqk61mdyAQSCrTLqzVYPxnk5rxys51VO2c5MTryeEeNOXfXiek";

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

  async requestPermission() {
    try {
      // First, request notification permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Subscribe to push notifications
        const subscription = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        });

        console.log('Push notification subscription:', subscription);

        // You can send this subscription to your backend
        // await this.sendSubscriptionToServer(subscription);

        // Example of showing a notification
        this.showNotification('Welcome!', 'You have successfully subscribed to notifications.');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  }

  showNotification(title: string, body: string) {
    if (this.swPush.isEnabled) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: body,
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        });
      });
    }
  }


}
