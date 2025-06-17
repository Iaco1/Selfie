import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TimeMachineService {
  private daySubject = new BehaviorSubject<Date>(new Date()); // Initialize with current date

  // Expose as Observable
  day$ = this.daySubject.asObservable();

  // Get current value (non-reactive)
  get day(): Date {
    return this.daySubject.value;
  }

  // Set a new day
  setDay(date: Date): void {
    this.daySubject.next(date);
  }
}
