import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

/**
 * Angular “DIY” notifications (not using the OS notifications and service workers)
 */
@Component({
  selector: 'app-notification',
  imports: [
    NgIf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  showbox = true;
  @Input()text: string = "Pomodoro cycle started!";

  constructor() {
  }

  close(){
    this.showbox = false;
  }
  // plays audio on display and on destroy
  ngAfterViewInit() {
    const audio = new Audio('notification-open.wav');
    audio.play();
  }
  ngOnDestroy() {
    const audio = new Audio('notification-closed.wav');
    audio.play();
  }

}
