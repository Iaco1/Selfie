import {Component} from '@angular/core';
import {CyclePhase} from './cyclephase.enum';
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {TimeMachineService} from '../services/time-machine.service';
import {take, takeWhile} from 'rxjs';

@Component({
  selector: 'app-pomodoro',
  imports: [
    FormsModule
  ],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.css'
})
export class PomodoroComponent {
  studyTimeInputHidden = false;
  cyclephase = CyclePhase.IDLE;
  breakTimeHidden = false;
  breakAnimationActive = false;
  studyAnimationActive = false;
  repetitionsHidden = true;
  cycleButton = "start cycle";
  nextPhase= "";
  intervalsSet = false;
  repetitionsSelectorHidden = true;

  sessionTime = {h: 0, m: 35, s: 0};
  pomodoroTime = {h: 0, m: 30, s: 0};
  breakTime = {h: 0, m: 5, s: 0};
  manualRepetitions = 5;
  repetitions = 5;
  sessionSecondsLeft = 0;
  pomodoroSecondsLeft = 0;
  breakSecondsLeft = 0;

  // in seconds
  pomodoroDuration = {h: 0, m: 30, s: 0};
  breakDuration = {h: 0, m: 5, s: 0};

  pomodoro = {startTime: new Date(Date.UTC(2000)), endTime: new Date(Date.UTC(2001)), duration: 1, competionStatus: false, authorId: ""};

  constructor(private router: Router, private timemachine: TimeMachineService) {}


  formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60);
    return {h: hrs, m: mins, s: secs};
  }


  autoComputeCycles(manual: boolean = false) {
    // computing in seconds
    let sTs : number = this.sessionTime.h*3600 + this.sessionTime.m*60;
    let pTs : number = this.pomodoroTime.h*3600 + this.pomodoroTime.m*60;
    let bTs : number = this.breakTime.m*60 + this.breakTime.s;

    if(manual) {
      this.repetitions = this.manualRepetitions
      sTs = (pTs + bTs) * this.repetitions;
    }else{
      this.repetitions = Math.floor(sTs / (pTs + bTs));
    }


    this.sessionSecondsLeft = sTs;
    this.pomodoroSecondsLeft = pTs;
    this.breakSecondsLeft = bTs;
    this.pomodoroDuration = this.pomodoroTime;
    this.breakDuration = this.breakTime;
  }

  emitNotification(){
    //this.router.navigate([{outlets: {asideRight: 'NotificationComponent'} }]);
  }

  startCycle(){
    this.nextPhase = "break";
    this.autoComputeCycles(true);
    this.resumeCycle();
    this.emitNotification();
  }

  resumeCycle(){
    this.cycleButton = "pause cycle";
    this.nextPhase = "break";
    this.cyclephase = CyclePhase.STUDYING;
    this.breakTimeHidden = true;
    this.breakAnimationActive = false;
    this.studyAnimationActive = true;
    this.repetitionsHidden = false;
    this.repetitionsSelectorHidden = true;

    this.timemachine.day$.pipe(take(1)).subscribe(
      (day) => {
        console.log("startTime: " + day);
        this.pomodoro.startTime = day;
      });
    this.timemachine.day$.pipe(
      takeWhile(() => this.pomodoroSecondsLeft > 0 && this.cyclephase == CyclePhase.STUDYING)).subscribe(
      (day) => {
        this.sessionSecondsLeft--;
        this.pomodoroSecondsLeft--;
        this.sessionTime = this.formatTime(this.sessionSecondsLeft);
        this.pomodoroTime = this.formatTime(this.pomodoroSecondsLeft);
      },
      () => {
        if(this.cyclephase == CyclePhase.STUDYING) this.pauseCycle(true);
      }
    )
  }

  pauseCycle(startBreak: boolean = true){
    this.cyclephase = CyclePhase.IDLE;
    this.nextPhase = "study";
    this.cycleButton = "resume cycle";
    this.studyAnimationActive = false;

    if(startBreak){
      this.cyclephase = CyclePhase.RESTING;
      this.breakTimeHidden = true;
      this.breakAnimationActive = true;
    }


    this.timemachine.day$.pipe(take(1)).subscribe(
      (day) => {
        this.pomodoro.endTime = day;
        console.log("endTime: " + day);
      }
    )
    this.timemachine.day$.pipe(takeWhile(() => this.breakSecondsLeft > 0 && this.cyclephase == CyclePhase.RESTING)).subscribe(
      (day) => {
        this.breakSecondsLeft--;
        this.sessionSecondsLeft--;
        this.sessionTime = this.formatTime(this.sessionSecondsLeft);
        this.breakTime = this.formatTime(this.breakSecondsLeft);
      },
      () => {
        if(this.cyclephase == CyclePhase.RESTING) this.resumeCycle();
      }
    )
  }


  toggleCycle() {
    if(this.cyclephase == CyclePhase.IDLE || this.cyclephase == CyclePhase.RESTING) {
      this.startCycle();
    }else if(this.cyclephase == CyclePhase.STUDYING){
      this.pauseCycle(true);
    }
    this.studyTimeInputHidden = true;
  }

  endSession() {
    this.nextPhase = "";
    this.studyTimeInputHidden = false;
    this.cyclephase = CyclePhase.IDLE;
    this.cycleButton = "start cycle";
    this.studyAnimationActive = false;
    this.breakAnimationActive = false;
    this.breakTimeHidden = false;
    this.repetitionsHidden = true;
    this.pomodoroTime = this.pomodoroDuration;
    this.breakTime = this.breakDuration;
    this.intervalsSet = !this.intervalsSet;
  }

  skipToNextCycle(){
    console.log("repetitions:" + this.repetitions);
    if(this.repetitions <=0){
      this.endSession();
      console.log("session ended");
      return;
    }

    switch (this.cyclephase) {
      case CyclePhase.RESTING:
        this.cyclephase = CyclePhase.RESTING;
        this.pauseCycle(false);
        break;
      case CyclePhase.STUDYING:
        this.cyclephase = CyclePhase.RESTING;
        this.pauseCycle(false); // i need a new method for stopping the pausing the cycle but not starting the breaktime
        //this.resumeCycle();
        break;
      case CyclePhase.IDLE:
        break;
    }
    this.repetitions--;
    this.pomodoroTime = this.pomodoroDuration;
    this.breakTime = this.breakDuration;
  }

  setIntervals(){
    this.intervalsSet = !this.intervalsSet;
    this.studyTimeInputHidden = !this.studyTimeInputHidden;
    this.breakTimeHidden = !this.breakTimeHidden;
    this.repetitionsSelectorHidden = false;
  }

  restartPomodoro(){
    this.pauseCycle(false);
    this.pomodoroTime = this.pomodoroDuration;
    this.breakTime = this.breakDuration;
  }
}
