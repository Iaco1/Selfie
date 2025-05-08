import { Component, Input } from '@angular/core';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'day',
  imports: [EventComponent],
  templateUrl: './day.component.html',
  styleUrl: './day.component.css'
})
export class DayComponent {
  constructor() {}

  @Input() day! : Date;

  @Input() visualize: string = "";

  getName() {
    return this.day.toLocaleString('en-US', { weekday: 'long' });
  }

  @Input() startHour: number = 8;
  @Input() endHour: number = 18;

  events: { [hour: number]: string } = {};

  toggleEvent(hour: number): void {
    this.events[hour] = this.events[hour] ? '' : 'Evento';
  }

  get hours(): number[] {
    const range: number[] = [];
    for (let h = this.startHour; h <= this.endHour; h++) {
      range.push(h);
    }
    return range;
  }
}
