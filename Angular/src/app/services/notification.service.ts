import {inject, Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {Observable} from 'rxjs';
import { keys } from '../../environments/keys';

declare type NotificationAction = {
  action: string;
  title: string;
  icon?: string;
};

/**
 * emits notification via the OS notification system
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
	private swPush = inject(SwPush);
	readonly VAPID_PUBLIC_KEY = keys.VAPID_PUBLIC_KEY;

  /**
   *
   */
  constructor() {
    this.requestPermission()
      .then(result => { console.log("request permission result: ", result)})
      .catch(err => {console.log("request permission error: ", err)});
  }

  /**
   * gets permission from the browser to display notifications
   */
  async requestPermission() {
  try {
    // requests notification permission
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

  /**
   * event that one can subscribe to to perform an action upon clicking the snooze button
   */
  onSnooze(): Observable<any>{
    return this.swPush.notificationClicks;
  }

  /**
   * test method for the onSnooze feature
   */
  runOnSnooze(){
    this.onSnooze().subscribe(({action, notification}) => {
      if (action === 'snooze') {
        // Handle snooze action
        this.showNotification('Snoozed!', 'You have snoozed the notification.', false, 1);
        // Add your snooze logic here
      }
    })
  }

  /**
   * displays the notification
   * @param title title of the notification
   * @param body main text of the notification
   * @param snoozeButton whether to add a snooze button or not
   * @param urgency a number from 0 to 2, determines which icon is displayed to indicate urgency
   */
  showNotification(title: string, body = "", snoozeButton = true, urgency: number = 0) {
    // picking the right icon based on the urgency
    let icon: string;
    switch (urgency) {
      case 1:
        icon = "/icons/danger.png";
        break;
      case 2:
        icon = "/icons/death.png"
        break;
      default:
        icon = '/icons/hourglass.png';

    }

    // if the user of the method required a snooze button, it adds it
    let actions: NotificationAction[];
    if(snoozeButton){
      actions = [{
        action: 'snooze',
        title: 'Snooze'
      }];

    }

    // displays the notification
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
