import { Component, Input } from '@angular/core';

@Component({
  selector: 'day',
  imports: [],
  templateUrl: './day.component.html',
  styleUrl: './day.component.css'
})
export class DayComponent {
  @Input() year: number = 0;
  @Input() month: number = 0;
  @Input() day: number = 0;
}
