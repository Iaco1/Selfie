import { Component } from '@angular/core';
import { MonthComponent } from '../month/month.component';
import { DateselectComponent } from '../dateselect/dateselect.component';

@Component({
  selector: 'calendar',
  imports: [DateselectComponent, MonthComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  day : Date = new Date();
  changedDay(item: Date) {
    this.day = item;
  }
}
