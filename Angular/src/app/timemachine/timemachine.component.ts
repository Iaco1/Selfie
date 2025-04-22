import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timemachine',
  imports: [CommonModule],
  templateUrl: './timemachine.component.html',
  styleUrl: './timemachine.component.css'
})
export class TimemachineComponent {
  default_time = new Date();
  today = new Date(this.default_time);
  //fai in modo che angular cambi il template...
  cambiaRiferimento(str : string) {
    this.today = new Date(this.today);
    console.log(str, this.today);
  }
  //funzioni normali
  default(): void {
    this.today = new Date(this.default_time);
    this.cambiaRiferimento("default button pressed");
  }
  //day
  prevDay(): void {
    this.today.setDate(this.today.getDate() - 1);
    this.cambiaRiferimento("PREV DAY pressed");
  }
  nextDay(): void {
    this.today.setDate(this.today.getDate() + 1);
    this.cambiaRiferimento("NEXT DAY pressed");
  }
  //month
  prevMonth(): void {
    this.today.setMonth(this.today.getMonth() - 1);
    this.cambiaRiferimento("PREV MONTH pressed")
  }
  nextMonth(): void {
    this.today.setMonth(this.today.getMonth() + 1);
    this.cambiaRiferimento("NEXT MONTH pressed")
  }
}
