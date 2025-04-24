import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DayComponent} from '../day/day.component';

@Component({
  selector: 'month',
  imports: [DayComponent, CommonModule],
  templateUrl: './month.component.html',
  styleUrl: './month.component.css'
})
export class MonthComponent {

  year: number = 0;
  month: number = 0;
  prev_days: number = 0;
  min: number = 0;
  month_days: number = 0;
  next_days: number = 0;
  private _day! : Date;

  @Input() 
  set day(value: Date) {
    this._day = value;
    this.recalculate();
  }
  get day(): Date {
    return this._day;
  }

  createRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
  constructor() {
    // Optionally initialize with today
    this.day = new Date();
  }

  //30 giorni a Novembre con April, Giugno e Settembre, di 28 ce ne` 1 tutti gli altri fan 31/
  getLastDayOfMonth(year : number, month : number) {
    let date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  week_days = [
    {id:0, name:"Monday"},
    {id:1, name:"Tuesday"},
    {id:2, name:"Wednesday"},
    {id:3, name:"Thurstday"},
    {id:4, name: "Friday"},
    {id:5, name:"Saturday"},
    {id:6, name:"Sunday"}];
  
  recalculate() {
    this.year = this._day.getFullYear();
    this.month = this._day.getMonth();
    this.prev_days = ((new Date(this.year, this.month, 1)).getDay() + 6) % 7;
    this.min = this.getLastDayOfMonth(this.year, ( this.month +11 ) % 12) - this.prev_days ;
    this.month_days = this.getLastDayOfMonth(this.year, this.month);
    this.next_days = (7 - ((this.prev_days + this.month_days) % 7)) %7;
    console.log(this.year, this.month, this.prev_days, this.min, this.month_days, this.next_days)
  }
}
