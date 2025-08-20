import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

/**
 * performs CRUDs of pomodoro object in the database plus some additional utility methods
 */
@Injectable({
  providedIn: 'root'
})
export class PomodoroService {

  constructor(private http: HttpClient) {}

  /**
   * gets a date and returns a string formatted in the en-US locale in the Europe/Rome timezone
   */
  formatDate(date: Date){
    return date.toLocaleString("en-US", {
        timeZone: "Europe/Rome",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
  }

  /**
   * gets a pomodoro object and converts its start and end times from `Date` to `String`
   * @param pomodoro
   */
  getStringDatesEquivalent(pomodoro: {startTime: Date; endTime: Date; duration: number; completionStatus: boolean; authorId: string | null}){
    return {
      startTime: this.formatDate(pomodoro.startTime),
      endTime: this.formatDate(pomodoro.endTime),
      duration: pomodoro.duration,
      completionStatus: pomodoro.completionStatus,
      authorId: pomodoro.authorId,
    }
  }

  /**
   * a request to the backend to post a pomodoro object, to add it to the database
   * @param pomodoro
   */
  insertPomodoro(pomodoro: { startTime: Date; endTime: Date; duration: number; completionStatus: boolean; authorId: string | null; }): Observable<any> {
    return this.http.post(environment.baseURL+"/pomodoro/", this.getStringDatesEquivalent(pomodoro));
  }

  /**
   * `any` type wrapper for insertPomodoro (which is type `Observable<any>`)
   */
  insert(pomodoro: {
    startTime: Date;
    endTime: Date;
    duration: number;
    completionStatus: boolean;
    authorId: string | null
  }){
    this.insertPomodoro(pomodoro).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  /**
   * requests all pomodoros associated to a user from the backend
   * @param userId
   */
  get(userId: string | null): Observable<any> {
    return this.http.get(environment.baseURL+`/pomodoro/${userId}`);
  }

  /**
   * requests deletion of one pomodoro associated to the user
   * @param pomodoroId
   */
  delete(pomodoroId: string): Observable<any>{
    return this.http.delete(environment.baseURL+`/pomodoro/${localStorage.getItem("authToken")}/${pomodoroId}`);
  }
}
