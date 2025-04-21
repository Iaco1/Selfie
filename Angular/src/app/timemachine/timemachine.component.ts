import { Component } from '@angular/core';

@Component({
  selector: 'app-timemachine',
  imports: [],
  templateUrl: './timemachine.component.html',
  styleUrl: './timemachine.component.css'
})
export class TimemachineComponent {
  default_time = new Date();
  today = new Date(this.default_time);
  default(): void {
    this.today = new Date(this.default_time);
    console.log("default button pressed", this.today);
  }
  prevDay(): void {
    this.today.setDate(this.today.getDate() - 1);
    console.log("PREV DAY pressed", this.today);
  }
  nextDay(): void {
    this.today.setDate(this.today.getDate() + 1);
    console.log("NEXT DAY pressed", this.today);
  }
  prevMonth(): void {
    this.today.setMonth(this.today.getMonth() - 1);
    console.log("PREV MONTH pressed", this.today);
  }
  nextMonth(): void {
    this.today.setMonth(this.today.getMonth() + 1);
    console.log("NEXT MONTH pressed", this.today);
  }
}
