import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

import { CalendarEvent } from '../types/calendar-event.model';
import { CalendarService } from '../services/calendar.service';

import { ActivityModel } from '../types/activity.model';
import { ActivityService } from '../services/activity.service';
import { CrudHelper } from '../utils/crud-helper';

@Component({
	selector: 'calendar',
	imports: [
		DateselectComponent,
		MonthComponent,
		DayComponent,
		WeekComponent,
		HttpClientModule
	],
	providers: [CalendarService, ActivityService],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

	day : Date = new Date();
	changedDay(item: Date) {
		this.day = item;
	}

	dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
	}
	createRange(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i + 1);
	}

	//events and activities uses crudHelper :D
	constructor(private calendarService: CalendarService,
		private activityService: ActivityService) {}

	events: CalendarEvent[] = [];
	activities: ActivityModel[] = [];

	private eventCrud!: CrudHelper<CalendarEvent>;
	private activityCrud!: CrudHelper<ActivityModel>;
	
	ngOnInit(): void {
		this.eventCrud = new CrudHelper(() => this.events, (l) => this.events = l);
		this.activityCrud = new CrudHelper(() => this.activities, (l) => this.activities = l);
	
		this.calendarService.getOnlyMyEvents().subscribe({
			next: events => {
				this.events = events;
			},
			error: err => console.error('Error loading events:', err)
		});
	
		this.activityService.getOnlyMyActivities().subscribe({
			next: activities => {
				this.activities = activities;
			},
			error: err => console.error('Error loading activities:', err)
		});
	}
		
	//events
	onSaveEvent(event: CalendarEvent) {
		this.eventCrud.save(event, this.calendarService);
	}
	onDeleteEvent(event: CalendarEvent) {
		this.eventCrud.delete(event, this.calendarService);
	}

	//activities
	onSaveActivity(activity: ActivityModel) {
		this.activityCrud.save(activity, this.activityService);
	}
	onDeleteActivity(activity: ActivityModel) {
		this.activityCrud.delete(activity, this.activityService);
	}
}
