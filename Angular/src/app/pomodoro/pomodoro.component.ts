import {Component} from '@angular/core';
import {CyclePhase} from './cyclephase.enum';
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {TimeMachineService} from '../services/time-machine.service';
import {concatMap, finalize, take, takeWhile} from 'rxjs';
import {PomodoroService} from '../services/pomodoro.service';
import {DecimalPipe} from '@angular/common';
import {NotificationService} from '../services/notification.service';
import {EventService} from '../services/event.service';
import {EventModel} from '../types/event.model';
import {UserService} from '../services/user.service';
import {StringDate} from '../types/string-date';

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

  eventCreationModalActive = false;
  event: EventModel;


  cyclephase = CyclePhase.IDLE; // current state of the timer
  cycleButton = "start cycle"; // display text for study/break timer



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

  // data of current pomodoro being recorded and of past pomodoros being displayed
  pomodoro = {startTime: new Date(Date.UTC(2000)), endTime: new Date(Date.UTC(2001)), duration: 1, completionStatus: true, authorId: localStorage.getItem('authToken')};
  pomodoroLog: any;

  /**
   * shows past pomodoros and set default values for the pomodoro event (that can be scheduled)
   */
  constructor(private router: Router, private timemachine: TimeMachineService, protected pomodoroService: PomodoroService, private notificationService: NotificationService, private eventService: EventService, private userService: UserService) {
    this.setPomodoroLog();

    //setting default pomodoro event
    const startDate = new StringDate("2025-08-30", "10:00:00");
    const duration = { number: this.sessionTime.h+ this.sessionTime.m/60, measure: "hours"};
    const title = "Pomodoro";
    const description = "scheduled pomodoro";
    const colour = "red";
    this.event = new EventModel(startDate,null,duration,title,colour, description,"fictitiousMail@mail.com")

  }

  resetPomodoroObject(){
    //this.pomodoro = {startTime: new Date(Date.UTC(2000)), endTime: new Date(Date.UTC(2001)), duration: 1, completionStatus: true, authorId: localStorage.getItem('authToken')};
  }

  /**
   * resets the study and break timers to the values needed to complete one repetition, set by the user before starting the session
   */
  resetCountdowns(){
    this.pomodoroSecondsLeft = this.pomodoroDuration.h*3600 + this.pomodoroDuration.m*60;
    this.breakSecondsLeft = this.breakDuration.m*60 + this.breakDuration.s;
    this.pomodoroTime = this.pomodoroDuration;
    this.breakTime = this.breakDuration;
  }

  /**
   * resets the study and break timers to the values needed to complete one repetition, set by default before starting the session
   */
  resetDefaultCountdowns(){
    this.pomodoroSecondsLeft = 1500;
    this.breakSecondsLeft = 300;
    this.pomodoroDuration = {h: 0, m: 25, s: 0};
    this.breakDuration= {h: 0, m: 5, s: 0};
  }

  /**
   * returns the seconds equivalent of a time object
   * @param time object structured in hours, minutes and seconds
   */
  formatTimeInSeconds(time: {h: number, m: number, s: number}){
    return time.h*3600 + time.m*60 + time.s;
  }

  /**
   * returns the `{h: hh, m: mm, s: ss}` equivalent of the time in seconds given to it
   */
  formatTimeInHMS(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60);
    return {h: hrs, m: mins, s: secs};
  }

  /**
   * sets the number of repetitions if we're not in the SET phase already
   * or if we're manually setting the number of repetitions
   *  via either the repetition increment input
   *  or the hours and minutes repetitions autocompute method
   * @param override whether to ignore the fact that the no. of repetition is already set (i.e. we're one repetition in and decide to reduce the session to a lesser number of repetitions) and recalculate the no. of repetition to do
   * @param manual whether to use the direct no. of repetitions given by the user (`manual==true`) or the session time (`manual=false`)
   */
  setRepetitions(override: boolean, manual: boolean = false){
    if(this.cyclephase !== CyclePhase.SET || override) this.autoComputeRepetitions(manual);
    else return;
  }

  /**
   * computes the no. of repetitions to be done.
   * if `manual` then the user indicated the no. of repetitions they want to do and we just need to compute the session time
   * if viceversa the user indicated the session time then we need to compute the no. of repetitions
   * @param manual whether the user indicated a no. of repetitions or not (in which case they indicated a session time from which we can calculate the no. of repetitions)
   */
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


  /**
   * sets the study and break timers to the times specified by the user,
   * sets the text of the main green button in the page (start cycle)
   * and computes the no. of repetitions to be done
   */
  readyCycle(){
    this.cyclephase = CyclePhase.READY;
    this.resetCountdowns();
    this.setCycleButton();
    this.setRepetitions(false, true);
  }

  /**
   * Computes repetitions from the session time.
   * Fundamental in case the user touched neither the repetition no. incrementer
   * nor the session time incrementers.
   *
   * starts the study cycle visually
   * and logs the start time to the pomodoro object that will later be sent to mongodb.
   * and re/starts the timer if it still has time left
   */
  startCycle(){
    this.setRepetitions(false);
    this.resumeCycle();
    this.logStartTime();
    if(this.pomodoroSecondsLeft > 0) {
      this.tickPomodoro();
    }
  }

  /**
   * sets green button text to pause cycle, changes phase to studying
   * and emits a notification via the system's OS about starting the pomodoro
   */
  resumeCycle(){
    this.cyclephase = CyclePhase.STUDYING;
    this.setCycleButton();
    this.notificationService.showNotification("session started");
  }


  /**
   * emits a notification about the pausing the pomodoro.
   * sets the cyclephase to resting and the green button text to resume cycle.
   *
   * logs the end time of the pomodoro
   *
   * One pomodoro log starts when the user presses start/resume cycle and ends when they press the pause cycle button.
   *
   * it re/starts the pause timer if there's time left on it
   */
  pauseCycle(){
    this.notificationService.showNotification("session paused");
    this.resumePause();
    this.logEndTime();
    if( this.breakSecondsLeft > 0) {
      this.tickBreak();
    }
  }

  /**
   * sets the cyclephase to resting and the green button to resume cycle
   */
  resumePause(){
    this.cyclephase = CyclePhase.RESTING;
    this.setCycleButton();
  }


  /**
   * starts the cycle if the phase is not studying
   * and pauses it if the phase is studying
   */
  toggleCycle() {
    if(this.cyclephase == CyclePhase.READY || this.cyclephase == CyclePhase.SET || this.cyclephase == CyclePhase.RESTING) this.startCycle();
    else if(this.cyclephase == CyclePhase.STUDYING) this.pauseCycle();
  }


  /**
   * returns the UI back to the Idle state.
   * resets default values for the pomodoro and rest timers.
   * and notifies the user about the session ending.
   */
  endSession() {
    this.cyclephase = CyclePhase.IDLE;
    this.resetDefaultCountdowns();
    this.notificationService.showNotification("session ended");
  }


  /**
   * If no more repetitions are left it ends the session.
   *
   * Else it sets up the UI as if the user ran through the pomodoro timer and the rest timer
   * and thus also decrements repetitions by one.
   */
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

  // methods regulating hiding/showing UI elements
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
  hideSchedule(){
    return this.cyclephase !== CyclePhase.SET;
  }

  /**
   * logs the start time of the pomodoro the user planned into the pomodoro log object that will later be sent to the backend
   */
  logStartTime(){
    this.timemachine.day$.pipe(take(1)).subscribe(
      (day) => {
        console.log("startTime: " + day);
        this.pomodoro.startTime = day;
      });
  }

  /**
   * makes the pomodoro timer decrement if the cyclephase is studying and there's time left on the pomodoro timer.
   * pauses when the timer runs out and there's break time left
   * or skips tp the next cycle if there's no break time left
   */
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

   /**
   * logs the end time of the pomodoro the user planned into the pomodoro log object that will later be sent to the backend
   */
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

  /**
   * decrements break timer if the cyclephase is resting and there's time left on the break timer.
   * restarts the pomodoro timer when the break timer runs out
   * else it skips to the next cycle if there are any reptitions left
   * or else it ends the session if there are no more repetitions left
   */
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

  /**
   * sets which text to display on the main green button of the timer.
   * - Start cycle if session hasn't started
   * - Pause cycle if study timer is ticking
   * - Resume cycle if pause timer is ticking
   */
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

  /**
   * fills the pomodoroLog object with the reversed list of pomodoro stored in mongodb (most recent first)
   */
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

  /**
   * deletes a logged pomodoro from the database and from the view
   */
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

  schedule(){
    // get user to choose date on calendar
    const startDate = new StringDate("2025-08-30", "10:00:00");
    const duration = { number: this.sessionTime.h+ this.sessionTime.m/60, measure: "hours"};
    const title = "Pomodoro";
    const description = "scheduled pomodoro";
    const colour = "red";
    this.userService.getAccountDetails(localStorage.getItem("authToken")).pipe(
      concatMap( res => this.eventService.create(new EventModel(startDate,null,duration,title,description,colour,res.user.email))
      )
    ).subscribe({
      next: (result) =>{
        console.log("calendar event creation result: ", result);
      },
      error: (error) => {
        console.log("error fetching user to add calendar event: ", error);
      }
    })
  }

  /**
   * shows a modal to schedule the pomodoro
   */
  showEventCreationModal(){
    this.eventCreationModalActive = true;
  }

  /**
   * hides a modal to schedule the pomodoro
   */
  closeEventCreationModal(){
    this.eventCreationModalActive = false;
  }

  /**
   * returns the current time
   */
  getToday(): Date{
    this.timemachine.day$.subscribe(
      (day) => {
        return day;
      }
    )
    return new Date(Date.UTC(2000))
  }
}
