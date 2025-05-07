import { Component } from '@angular/core';
import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
// import { EventComponent } from './event/event.component';

@Component({
  selector: 'calendar',
  imports: [
    DateselectComponent,
    MonthComponent,
    DayComponent,
  //EventComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  day : Date = new Date();
  changedDay(item: Date) {
    this.day = item;
  }
  dwmy : string = "m"
  changedDwmy(item: string) {
    this.dwmy = item;
  }
  createRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
  //gestione della week
  days: { id: number; date: Date }[] = [];
  private createDayArray(length: number, year: number, month: number, start: number) {
    this.days = Array.from({ length: length }, (_, i) => ({
      id: i + 1,                        // id: (1-7)
      date: new Date(year, month, start + i + 1)  // real Date object
    }));
    //console.log(this.days);
  }
  private getStartOfWeek(): Date {
    const today = new Date(this.day);
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
    // If today is Sunday (0), we need to calculate the Monday of the *previous* week
    if (dayOfWeek === 0) {
      // Subtract 6 days from Sunday to get the previous Monday
      startOfWeek.setDate(today.getDate() - 6 );
    } else {
      // Otherwise, subtract the days to get the current week's Monday
      startOfWeek.setDate(today.getDate() - dayOfWeek);
    }
    //console.log('Today:', today.getDate(), 'Start of Week:', startOfWeek.getDate());
    return startOfWeek;
  }
  createWeek() {
    const start = this.getStartOfWeek()
    this.createDayArray(7, start.getFullYear(), start.getMonth(), start.getDate());
    return this.days;
  }
}
