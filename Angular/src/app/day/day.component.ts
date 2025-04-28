import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-day',
  imports: [],
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
  @Input() is_long = false;
  getName() {
    return this.day.toLocaleString('en-US', { weekday: 'long' });
  }
}
