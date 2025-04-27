import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dateselect',
  imports: [CommonModule, FormsModule],
  templateUrl: './dateselect.component.html',
  styleUrl: './dateselect.component.css'
})
export class DateselectComponent {

  @Output() changedDayEvent = new EventEmitter<Date>();
  
  default_time = new Date();
  today = new Date(this.default_time);

  @Output() changeDWMY = new EventEmitter<string>();
  dwmy: ' ' | 'd' | 'w' | 'm' | 'y' = "m";
  onDwmyChange(newValue: string) {
    this.changeDWMY.emit(newValue);
  }

  //fai in modo che angular cambi il template...
  cambiaRiferimento(str : string) {
    this.today = new Date(this.today);
    this.changedDayEvent.emit(this.today);
//  console.log(str, this.today);
  }
  //funzioni normali
  default(): void {
    this.today = new Date(this.default_time);
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

