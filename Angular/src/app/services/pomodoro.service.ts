import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {

  constructor(private http: HttpClient) {}

  getStringDatesEquivalent(pomodoro: {startTime: Date; endTime: Date; duration: number; completionStatus: boolean; authorId: string | null}){
    return {
      startTime: pomodoro.startTime.toISOString(),
      endTime: pomodoro.endTime.toISOString(),
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
}
