import {inject, Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {Observable} from 'rxjs';

declare type NotificationAction = {
  action: string;
  title: string;
  icon?: string;
};


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
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
  }
  }

  onSnooze(): Observable<any>{
    // call when action is performed
    return this.swPush.notificationClicks;
  }

  runOnSnooze(){
    this.onSnooze().subscribe(({action, notification}) => {
      if (action === 'snooze') {
        // Handle snooze action
        this.showNotification('Snoozed!', 'You have snoozed the notification.', false, 1);
        // Add your snooze logic here
      }
    })
  }

  showNotification(title: string, body: string, snoozeButton = true, urgency: number = 2) {
    let icon: string;
    switch (urgency) {
      case 1:
        icon = "https://images.emojiterra.com/google/android-12l/512px/203c.png";
        break;
      case 2:
        icon = "https://www.shutterstock.com/shutterstock/photos/2629393653/display_1500/stock-vector-pixel-triple-exclamation-marks-vector-for-dramatic-alert-loud-comic-or-strong-retro-message-2629393653.jpg"
        break;
      default:
        icon = 'https://img.freepik.com/free-psd/3d-red-exclamation-mark-bold-shiny-attentiongrabbing_191095-87778.jpg?t=st=1749875914~exp=1749879514~hmac=f145b00b99a11692b6fbbbadb39a51b20cc70f9b1fa30fbd94f9b84889c218b1';

    }

    let actions: NotificationAction[];
    if(snoozeButton){
      actions = [{
        action: 'snooze',
        title: 'Snooze'
      }];

    }

    if (this.swPush.isEnabled) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: body,
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: actions,
          icon: icon,
        } as NotificationOptions);
      });
    }
  }
}
