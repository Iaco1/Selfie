import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {

  constructor(private http: HttpClient) {}

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

  getStringDatesEquivalent(pomodoro: {startTime: Date; endTime: Date; duration: number; completionStatus: boolean; authorId: string | null}){
    return {
      startTime: this.formatDate(pomodoro.startTime),
      endTime: this.formatDate(pomodoro.endTime),
      duration: pomodoro.duration,
      completionStatus: pomodoro.completionStatus,
      authorId: pomodoro.authorId,
    }
  }

  insertPomodoro(pomodoro: { startTime: Date; endTime: Date; duration: number; completionStatus: boolean; authorId: string | null; }): Observable<any> {
    return this.http.post(environment.baseURL+"/pomodoro/", this.getStringDatesEquivalent(pomodoro));
  }

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

  get(userId: string | null): Observable<any> {
    return this.http.get(environment.baseURL+`/pomodoro/${userId}`);
  }

  delete(pomodoroId: string): Observable<any>{
    return this.http.delete(environment.baseURL+`/pomodoro/${localStorage.getItem("authToken")}/${pomodoroId}`);
  }
}
