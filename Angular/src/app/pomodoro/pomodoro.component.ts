import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {CyclePhase} from './cyclephase.enum';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pomodoro',
  imports: [],
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
  @ViewChild('toggleCycleBtn') toggleCycleBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('totalSessionTimeHours') tsth! : ElementRef<HTMLInputElement>;
  @ViewChild('totalSessionTimeMinutes') tstm! : ElementRef<HTMLInputElement>;
  @ViewChild('studyingTimeIntervalHours') stih! : ElementRef<HTMLInputElement>;
  @ViewChild('studyingTimeIntervalMinutes') stim! : ElementRef<HTMLInputElement>;
  @ViewChild('breakInterval') bi!: ElementRef<HTMLInputElement>;
  @ViewChild('repetitionsInput') repetitionsInput!: ElementRef<HTMLInputElement>;
  repetitionsLeft = 5;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.repetitionsLeft = Number(this.repetitionsInput.nativeElement.value);
  }


  autoComputeCycles() {
    let tst : number = Number(this.tsth.nativeElement.value)*60 + Number(this.tstm.nativeElement.value);
    let si : number = Number(this.stih.nativeElement.value)*60 + Number(this.stim.nativeElement.value);
    let bi : number = Number(this.bi.nativeElement.value);
    this.autocomputedcycles = Math.floor(tst / (si + bi));
  }

  emitNotification(){
    this.router.navigate([{outlets: {asideRight: 'NotificationComponent'} }]);
  }

  startCycle(){
    this.repetitionsLeft = Number(this.repetitionsInput.nativeElement.value);
    this.resumeCycle();
    this.emitNotification();
  }

  resumeCycle(){
    this.toggleCycleBtn.nativeElement.innerText = "pause cycle";
    this.cyclephase = CyclePhase.STUDYING;
    this.breakTimeHidden = false;
    this.breakAnimationActive = false;
    this.studyAnimationActive = true;
    this.repetitionsLeftHidden = false;
    this.repetitionsInputHidden = true;
  }

  pauseCycle(){
    this.toggleCycleBtn.nativeElement.innerText = "resume cycle";
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
    this.toggleCycleBtn.nativeElement.innerText = "start cycle";
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
