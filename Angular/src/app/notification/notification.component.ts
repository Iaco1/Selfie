import {Component, Input} from '@angular/core';
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
  @Input()text: string = "Pomodoro cycle started!";

  constructor() {
  }

  close(){
    this.showbox = false;
  }

  ngAfterViewInit() {
    const audio = new Audio('notification-open.wav');
    audio.play();
  }

  ngOnDestroy() {
    const audio = new Audio('notification-closed.wav');
    audio.play();
  }

}
