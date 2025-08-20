import { Component } from '@angular/core';
import {PomodoroService} from '../services/pomodoro.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [
    DecimalPipe
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  // last pomodoro recorded data
  lastPomodoro: any;
  startTime = "last pomodoro fetch failed or is yet to happen";
  duration = 0;

  constructor(private pomodoroService: PomodoroService) {
    //displaying the last pomodoro recorded
    this.pomodoroService.get(localStorage.getItem('authToken')!).subscribe({
      next: (response) => {
        console.log("get pomodoros result: ", response);
        this.lastPomodoro = response.pomodoro.at(-1);
        this.startTime = this.lastPomodoro.startTime;
        this.duration = this.lastPomodoro.duration;
      },
      error: (error) => {
        console.log("get pomodoros failed: ", error);
      }
    });
  }
}
