import {Component} from '@angular/core';
import {NgIf} from '@angular/common';

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

  constructor() {}

  close(){
    this.showbox = false;
  }

  ngAfterViewInit() {
    const audio = new Audio('notification-tone.mp3');
    audio.play();
  }

}
