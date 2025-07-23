import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {NotificationComponent} from '../notification/notification.component';

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

  addNotification(message: string){
    const componentRef = this.container.createComponent(NotificationComponent);
    componentRef.instance.text = message;

    // Remove notification after some time
    setTimeout(() => {
      componentRef.destroy();
    }, 25000); // 25 seconds
  }

  ngAfterContentInit() {
    this.addNotification("LA GARRA CHARRUAAA");
  }
}
