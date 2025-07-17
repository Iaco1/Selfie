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
  autocomputedcycles = 1;
  studyTimeInputHidden = false;
  cyclephase = CyclePhase.IDLE;
  breakTimeHidden = false;
  breakAnimationActive = false;
  studyAnimationActive = false;
  repetitionsLeftHidden = true;
  repetitionsInputHidden = false;
  cycleButton = "start cycle";

  sessionTime = {h: 0, m: 0, s: 0};
  pomodoroTime = {h: 0, m: 30, s: 0};
  breakTime = { m: 5, s: 0};
  repetitions = 5;
  repetitionsLeft = 5;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.repetitionsLeft = this.repetitions;
  }


  autoComputeCycles() {
    let sT : number = this.sessionTime.h*60 + this.sessionTime.m;
    let pT : number = this.pomodoroTime.h*60 + this.pomodoroTime.m;
    let bT : number = this.breakTime.m;
    this.autocomputedcycles = Math.floor(sT / (pT + bT));
  }

  emitNotification(){
    this.router.navigate([{outlets: {asideRight: 'NotificationComponent'} }]);
  }

  startCycle(){
    this.repetitionsLeft = this.repetitions;
    this.resumeCycle();
    this.emitNotification();
  }

  resumeCycle(){
    this.cycleButton = "pause cycle";
    this.cyclephase = CyclePhase.STUDYING;
    this.breakTimeHidden = false;
    this.breakAnimationActive = false;
    this.studyAnimationActive = true;
    this.repetitionsLeftHidden = false;
    this.repetitionsInputHidden = true;
  }

  pauseCycle(){
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
    this.studyTimeInputHidden = false;
    this.cyclephase = CyclePhase.IDLE;
    this.cycleButton = "start cycle";
    this.studyAnimationActive = false;
    this.breakAnimationActive = false;
    this.breakTimeHidden = false;
    this.repetitionsLeftHidden = true;
    this.repetitionsInputHidden = false;
  }

  skipToNextCycle(){
    console.log("repetitionsLeft:" + this.repetitionsLeft);
    if(this.repetitionsLeft <=0){
      this.endSession();
      console.log("session ended");
      return;
    }

    switch (this.cyclephase) {
      case CyclePhase.RESTING:
        console.log("studying");
        this.cyclephase = CyclePhase.STUDYING;
        this.repetitionsLeft--;
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
