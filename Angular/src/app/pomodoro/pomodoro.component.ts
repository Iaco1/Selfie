import {Component} from '@angular/core';
import {CyclePhase} from './cyclephase.enum';
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {TimeMachineService} from '../services/time-machine.service';
import {finalize, take, takeWhile} from 'rxjs';
import {PomodoroService} from '../services/pomodoro.service';
import {DecimalPipe} from '@angular/common';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'app-pomodoro',
  imports: [
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.css'
})
export class PomodoroComponent {
  cyclephase = CyclePhase.IDLE;
  cycleButton = "start cycle";


  //countdowns
  pomodoroSecondsLeft = 0;
  breakSecondsLeft = 0;
  pomodoroTime = {h: 0, m: 25, s: 0};
  breakTime = {h: 0, m: 5, s: 0};

  //session durations
  repetitions = 3;
  sessionTime = {h: 1, m: 30, s: 0};

  //cycle durations
  pomodoroDuration = {h: 0, m: 25, s: 0};
  breakDuration = {h: 0, m: 5, s: 0};


  pomodoro = {startTime: new Date(Date.UTC(2000)), endTime: new Date(Date.UTC(2001)), duration: 1, completionStatus: true, authorId: localStorage.getItem('authToken')};
  pomodoroLog: any;

  constructor(private router: Router, private timemachine: TimeMachineService, protected pomodoroService: PomodoroService, private notificationService: NotificationService) {
    this.setPomodoroLog();
  }

  resetPomodoroObject(){
    //this.pomodoro = {startTime: new Date(Date.UTC(2000)), endTime: new Date(Date.UTC(2001)), duration: 1, completionStatus: true, authorId: localStorage.getItem('authToken')};
  }

  resetCountdowns(){
    this.pomodoroSecondsLeft = this.pomodoroDuration.h*3600 + this.pomodoroDuration.m*60;
    this.breakSecondsLeft = this.breakDuration.m*60 + this.breakDuration.s;
    this.pomodoroTime = this.pomodoroDuration;
    this.breakTime = this.breakDuration;
  }

  resetDefaultCountdowns(){
    this.pomodoroSecondsLeft = 1500;
    this.breakSecondsLeft = 300;
    this.pomodoroDuration = {h: 0, m: 25, s: 0};
    this.breakDuration= {h: 0, m: 5, s: 0};
  }

  formatTimeInSeconds(time: {h: number, m: number, s: number}){
    return time.h*3600 + time.m*60 + time.s;
  }

  formatTimeInHMS(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60);
    return {h: hrs, m: mins, s: secs};
  }

  setRepetitions(override: boolean, manual: boolean = false){
    if(this.cyclephase !== CyclePhase.SET || override) this.autoComputeRepetitions(manual);
    else return;
  }


  autoComputeRepetitions(manual: boolean = false) {
    if(manual) {
      const sessionSeconds = this.repetitions * (this.pomodoroDuration.h*3600 + this.pomodoroDuration.m*60 + this.breakDuration.m*60 + this.breakDuration.s);
      this.sessionTime = this.formatTimeInHMS(sessionSeconds)
    }else{
      // computing in seconds
      let sTs : number = this.sessionTime.h*3600 + this.sessionTime.m*60;
      let pTs : number = this.pomodoroDuration.h*3600 + this.pomodoroDuration.m*60;
      let bTs : number = this.breakDuration.m*60 + this.breakDuration.s;
      this.repetitions = Math.floor(sTs / (pTs + bTs));
    }
    this.cyclephase = CyclePhase.SET;
  }

  emitNotification(){
    //this.router.navigate([{outlets: {asideRight: 'NotificationComponent'} }]);
  }


  readyCycle(){
    this.cyclephase = CyclePhase.READY;
    this.resetCountdowns();
    this.setCycleButton();
    this.setRepetitions(false, true);
  }


  startCycle(){
    this.setRepetitions(false);
    this.resumeCycle();
    this.logStartTime();
    if(this.pomodoroSecondsLeft > 0) {
      this.tickPomodoro();
    }
  }


  resumeCycle(){
    this.cyclephase = CyclePhase.STUDYING;
    this.setCycleButton();
    this.notificationService.showNotification("session started");
  }


  pauseCycle(){
    this.notificationService.showNotification("session paused");
    this.resumePause();
    this.logEndTime();
    if( this.breakSecondsLeft > 0) {
      this.tickBreak();
    }
  }

  resumePause(){
    this.cyclephase = CyclePhase.RESTING;
    this.setCycleButton();
  }


  toggleCycle() {
    if(this.cyclephase == CyclePhase.READY || this.cyclephase == CyclePhase.SET || this.cyclephase == CyclePhase.RESTING) this.startCycle();
    else if(this.cyclephase == CyclePhase.STUDYING) this.pauseCycle();
  }


  endSession() {
    this.cyclephase = CyclePhase.IDLE;
    this.resetDefaultCountdowns();
    this.notificationService.showNotification("session ended");
  }


  skipToNextCycle(){
    if(this.repetitions > 0){
      this.notificationService.showNotification("repetition completed");
      this.repetitions--;
      this.readyCycle();
    }else{
      this.endSession();
    }
  }

  restartPomodoro(){
    this.readyCycle();
  }

  hideTimeInputs(){
    return this.cyclephase !== CyclePhase.IDLE;
  }

  hideCountdowns(){
    return this.cyclephase === CyclePhase.IDLE;
  }

  runBreakAnimation(){
    return this.cyclephase === CyclePhase.RESTING;
  }

  runStudyAnimation(){
    return this.cyclephase === CyclePhase.STUDYING;
  }

  hideBreakAnimation(){
    return this.cyclephase !== CyclePhase.RESTING;
  }
  hideStudyAnimation(){
    return this.cyclephase !== CyclePhase.STUDYING;
  }

  hideRepetitionsLeft(){
    return this.cyclephase === CyclePhase.IDLE || this.cyclephase === CyclePhase.READY || this.cyclephase === CyclePhase.SET;
  }

  hideSetIntervals(){
    return this.cyclephase !== CyclePhase.IDLE;
  }

  hideMainInterface(){
    return this.cyclephase === CyclePhase.IDLE;
  }

  hideRestart(){
    return this.cyclephase !== CyclePhase.STUDYING && this.cyclephase !== CyclePhase.RESTING;
  }

  hideRepetitionSelector(){
    return this.cyclephase !== CyclePhase.READY && this.cyclephase !== CyclePhase.SET;
  }

  hideSkip(){
    return this.cyclephase !== CyclePhase.STUDYING && this.cyclephase !== CyclePhase.RESTING;
  }

  logStartTime(){
    this.timemachine.day$.pipe(take(1)).subscribe(
      (day) => {
        console.log("startTime: " + day);
        this.pomodoro.startTime = day;
      });
  }

  tickPomodoro(){
    this.timemachine.day$.pipe(
      takeWhile(() => this.pomodoroSecondsLeft > 0 && this.cyclephase == CyclePhase.STUDYING),
      finalize(() => {
        if(this.cyclephase == CyclePhase.RESTING || this.cyclephase == CyclePhase.IDLE || this.cyclephase == CyclePhase.READY || this.cyclephase == CyclePhase.SET) return;
        else if(this.breakSecondsLeft > 0) this.pauseCycle();
        else this.skipToNextCycle();
      })
    ).subscribe(
      (day) => {
        this.pomodoroSecondsLeft = Math.round(this.formatTimeInSeconds(this.pomodoroDuration) - (Math.abs(day.getTime() - this.pomodoro.startTime.getTime())/1000));
        this.pomodoroTime = this.formatTimeInHMS(this.pomodoroSecondsLeft);
      }
    )
  }

  logEndTime(){
    this.timemachine.day$.pipe(take(1)).subscribe(
      (day) => {
        this.pomodoro.endTime = day;
        console.log("endTime: " + day);
        this.pomodoro.duration = (this.pomodoro.endTime.getTime() - this.pomodoro.startTime.getTime())/1000;
        this.pomodoroService.insert(this.pomodoro);
        this.resetPomodoroObject();
      }
    )
  }

  tickBreak(){
    this.timemachine.day$.pipe(
      takeWhile(() => this.breakSecondsLeft > 0 && this.cyclephase == CyclePhase.RESTING),
      finalize(() => {
        if(this.cyclephase == CyclePhase.STUDYING || this.cyclephase == CyclePhase.IDLE || this.cyclephase == CyclePhase.READY || this.cyclephase == CyclePhase.SET) return;
        else if(this.pomodoroSecondsLeft > 0) this.startCycle();
        else if(this.repetitions > 0) this.skipToNextCycle();
        else this.endSession()
      })
      ).subscribe(
      (day) => {
        console.log("time elapsed since pomodoro end: ", Math.abs(day.getTime() - this.pomodoro.endTime.getTime())/1000);
        this.breakSecondsLeft = Math.round(this.formatTimeInSeconds(this.breakDuration) - (Math.abs(day.getTime() - this.pomodoro.endTime.getTime())/1000));
        this.breakTime = this.formatTimeInHMS(this.breakSecondsLeft);
      }
    )
  }

  setCycleButton(){
    switch(this.cyclephase){
      case CyclePhase.READY:
      case CyclePhase.SET:
        this.cycleButton = "start cycle";
        break;
      case CyclePhase.STUDYING:
        this.cycleButton = "pause cycle";
        break;
      case CyclePhase.RESTING:
        this.cycleButton = "resume cycle";
        break;
      default:
        break;
    }
  }

  setPomodoroLog(){
    this.pomodoroService.get(localStorage.getItem("authToken")).subscribe({
      next: (response) => {
        //console.log("pomodoro log: ", response.pomodoro);
        this.pomodoroLog = response.pomodoro.reverse();
      },
      error: (error) => {
        console.log("error: ", error);
      }
    });
  }

  deletePomodoro(id: string) {
    console.log("trying to delete pomodoroId: ", id);
    this.pomodoroService.delete(id).subscribe({
      next: (response) => {
        console.log("deletion response: ", response);
        this.setPomodoroLog();
      },
      error: (error) => {
        console.log("deletion error: ", error);
      }
    })
  }
}
