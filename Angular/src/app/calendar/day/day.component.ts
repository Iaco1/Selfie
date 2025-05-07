import { Component, Input } from '@angular/core';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-day',
  imports: [EventComponent],
  templateUrl: './day.component.html',
  styleUrl: './day.component.css'
})
export class DayComponent {
  constructor() {}

  private _day! : Date;
  @Input()
  set day(item: Date) {
    this._day = item;
  }
  get day() {
    return this._day;
  }

  @Input() visualize: string = "";

  getName() {
    return this.day.toLocaleString('en-US', { weekday: 'long' });
  }
}
