import {inject, Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private swPush = inject(SwPush);
  readonly VAPID_PUBLIC_KEY = "BH-EyqqZPrkQVCKY5w0CWkO6X8cu6D9cR31Z-fqk61mdyAQSCrTLqzVYPxnk5rxys51VO2c5MTryeEeNOXfXiek";

  constructor() {
    this.requestPermission()
      .then(result => { console.log("request permission result: ", result)})
      .catch(err => {console.log("request permission error: ", err)});
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
