import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthComponent } from '../month/month.component';

@Component({
  selector: 'calendar',
  imports: [CommonModule, FormsModule, MonthComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  default_time = new Date();
  day = new Date(this.default_time);

  dwmy: ' ' | 'd' | 'w' | 'm' | 'y' = "m";

  //fai in modo che angular cambi il template...
  cambiaRiferimento(str : string) {
    this.day = new Date(this.day);
    //console.log(str, this.day);
  }
  //funzioni normali
  default(): void {
    this.day = new Date(this.default_time);
    this.cambiaRiferimento("default button pressed");
  }
  aggiornaData(
    direz: 'prev' | 'next',
    dwmy: ' ' | 'd' | 'w' | 'm' | 'y',
    today: Date
  ): void {
    const operazioni: Record<' ' | 'd' | 'w' | 'm' | 'y', () => void> = {
      d: () => today.setDate(today.getDate() + (direz === 'next' ? 1 : -1)),
      w: () => today.setDate(today.getDate() + (direz === 'next' ? 7 : -7)),
      m: () => today.setMonth(today.getMonth() + (direz === 'next' ? 1 : -1)),
      y: () => today.setFullYear(today.getFullYear() + (direz === 'next' ? 1 : -1)),
      ' ': () => {console.log("error")},
    };
    operazioni[dwmy]();
    this.cambiaRiferimento(direz + this.dwmy);
  }
}
