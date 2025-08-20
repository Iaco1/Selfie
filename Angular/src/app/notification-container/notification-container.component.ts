import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {NotificationComponent} from '../notification/notification.component';

/**
 * overlay plane to display notifications into using only angular.
 */
@Component({
  selector: 'app-notification-container',
  imports: [],
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.css'
})
export class NotificationContainerComponent {
  @ViewChild('notificationContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor() {
  }

  /**
   * adds a notification to the this container
   * @param message message to be displayed
   */
  addNotification(message: string){
    const componentRef = this.container.createComponent(NotificationComponent);
    componentRef.instance.text = message;

    // Remove notification after some time
    setTimeout(() => {
      componentRef.destroy();
    }, 25000); // 25 seconds
  }

  /**
   * test notification
   */
  ngAfterContentInit() {
    //this.addNotification("LA GARRA CHARRUAAA");
  }
}
