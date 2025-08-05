import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayComponent } from '../day/day.component';
import { EventModel } from '../../types/event.model';
import { } from '@angular/core';
import { ActivityModel } from '../../types/activity.model';

@Component({
	selector: 'month',
	imports: [DayComponent, CommonModule],
	templateUrl: './month.component.html',
	styleUrl: './month.component.css'
})
export class MonthComponent {

	prev_days: number = 0;
	min: number = 0;
	month_days: number = 0;
	next_days: number = 0;
	
	private _year! : number;
	private _month! : number;
	private _day! : Date;

	@Input() visualize: string = "";
	@Input() 
	set year(value: number) { this._year = value; this.recalculate(); }
	get year() {return this._year}
		
	@Input()
	set month(value: number) { this._month = value; this.recalculate(); }
	get month() { return this._month; }

	@Input() 
	set day(value: Date) {
		this._day = value;
		this._year = this._day.getFullYear();
		this._month = this._day.getMonth();
		this.recalculate();
	}
	get day(): Date {
		return this._day;
	}

	constructor() {}
	createRange(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i + 1);
	}

	days: { id: number; date: Date }[] = [];
	private populateDays() {
		this.days = Array.from({ length: this.month_days }, (_, i) => ({
			id: i + 1,										// id: day number (1-30)
			date: new Date(this.year, this.month, i + 1)	// real Date object
		}));
	}

	ngOnInit() {
		this.populateDays();
	}

	//30 giorni a Novembre con April, Giugno e Settembre, di 28 ce ne` 1 tutti gli altri fan 31/
	getLastDayOfMonth(_year : number, month : number) {
		let date = new Date(_year, month + 1, 0);
		return date.getDate();
	}
	getName(i: number) {
		let date = new Date(2023, i);
		let a = date.toLocaleString('en-US', { month: 'long' });
		return a;
	}

	week_days = [
		{id:0, name:"Monday"},
		{id:1, name:"Tuesday"},
		{id:2, name:"Wednesday"},
		{id:3, name:"Thurstday"},
		{id:4, name:"Friday"},
		{id:5, name:"Saturday"},
		{id:6, name:"Sunday"}];
	
	recalculate() {
		if(this.month != undefined && this.year != undefined ) {
			this.prev_days = ((new Date(this._year, this._month, 1)).getDay() + 6) % 7;
			this.min = this.getLastDayOfMonth(this._year, ( this._month +11 ) % 12) - this.prev_days ;
			this.month_days = this.getLastDayOfMonth(this._year, this._month);
			this.next_days = (7 - ((this.prev_days + this.month_days) % 7)) %7;
			//console.log(this._year, this._month, this.prev_days, this.min, this.month_days, this.next_days);
			this.populateDays();
		}
	}

	//events
	@Input() events: EventModel[] = [];
	
	@Output() saveEvent = new EventEmitter<EventModel>();
	@Output() deleteEvent = new EventEmitter<EventModel>();
	onSaveEvent(updatedEvent: EventModel) {
		this.saveEvent.emit(updatedEvent);
	}
	onDeleteEvent(eventToDelete: EventModel) {
		this.deleteEvent.emit(eventToDelete);
	}

	//activities
	@Input() activities: ActivityModel[] = [];
	
	@Output() saveActivity = new EventEmitter<ActivityModel>();
	@Output() deleteActivity = new EventEmitter<ActivityModel>();
	onSaveActivity(updatedActivity: ActivityModel) {
		this.saveActivity.emit(updatedActivity);
	}
	onDeleteActivity(activityToDelete: ActivityModel) {
		this.deleteActivity.emit(activityToDelete);
	}
}
