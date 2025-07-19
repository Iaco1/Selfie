import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {CyclePhase} from './cyclephase.enum';
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';

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
  repetitionsInputHidden = false;
  cycleButton = "start cycle";
  nextPhase= "";

  sessionTime = {h: 0, m: 0, s: 0};
  pomodoroTime = {h: 0, m: 30, s: 0};
  breakTime = { m: 5, s: 0};
  repetitions = 5;

  sessionSecondsLeft = 0;
  pomodoroSecondsLeft = 0;
  breakSecondsLeft = 0;

  constructor(private router: Router) {}


  formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60);
    return {h: hrs, m: mins, s: secs};
  }


  autoComputeCycles() {
    // computing in seconds
    let sTs : number = this.sessionTime.h*3600 + this.sessionTime.m*60;
    let pTs : number = this.pomodoroTime.h*3600 + this.pomodoroTime.m*60;
    let bTs : number = this.breakTime.m*60;
    this.repetitions = Math.floor(sTs / (pTs + bTs));

    this.sessionSecondsLeft = sTs;
    this.pomodoroSecondsLeft = pTs;
    this.breakSecondsLeft = bTs;
  }

  emitNotification(){
    this.router.navigate([{outlets: {asideRight: 'NotificationComponent'} }]);
  }

  startCycle(){
    this.nextPhase = "break";
    this.resumeCycle();
    this.emitNotification();
  }

  resumeCycle(){
    this.cycleButton = "pause cycle";
    this.nextPhase = "break";
    this.cyclephase = CyclePhase.STUDYING;
    this.breakTimeHidden = false;
    this.breakAnimationActive = false;
    this.studyAnimationActive = true;
    this.repetitionsHidden = false;
    this.repetitionsInputHidden = true;
  }

  pauseCycle(){
    this.nextPhase = "study";
    this.cycleButton = "resume cycle";
    this.cyclephase = CyclePhase.RESTING;
    this.breakTimeHidden = true;
    this.studyAnimationActive = false;
    this.breakAnimationActive = true;
  }


  toggleCycle() {
    if(this.cyclephase == CyclePhase.IDLE || this.cyclephase == CyclePhase.RESTING) {
      this.startCycle();
    }else if(this.cyclephase == CyclePhase.STUDYING){
      this.pauseCycle();
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
    this.repetitionsInputHidden = false;
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
        console.log("studying");
        this.cyclephase = CyclePhase.STUDYING;
        this.repetitions--;
        this.resumeCycle();
        break;
      case CyclePhase.STUDYING:
        console.log("resting");
        this.cyclephase = CyclePhase.RESTING;
        this.pauseCycle();
        break;
      case CyclePhase.IDLE:
        break;
    }
  }
}
