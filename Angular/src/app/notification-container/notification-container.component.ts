import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {NotificationComponent} from '../notification/notification.component';
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.css'
})
export class NotificationContainerComponent {
  @ViewChild('notificationContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  token: string = "";

  constructor(private notificationService: NotificationService) {
  }

  async ngOnInit() {
    await this.notificationService.listenToMessages();
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
    //this.addNotification("LA GARRA CHARRUAAA");
    this.enableNotifications().then(() => console.log('Notifications enabled')).catch(err => console.error('Error enabling notifications', err));
  }

  sendNotification(){
    this.notificationService.post(this.token, "I'm on your Android mobile?", "like for real dude?").subscribe({
      next: (response) => {
        console.log("post result: ", response);
      },
      error: (error) => {
        console.log("post failed: ", error);
      }
    })
  }

  async enableNotifications() {
    const token = await this.notificationService.requestPermission();
    if (token) {
      // Send this token to your backend server to save it for later use
      console.log('Token received:', token);
      this.token = token;
      this.sendNotification();
    }else {
      console.log('No token received');
    }
  }

}
