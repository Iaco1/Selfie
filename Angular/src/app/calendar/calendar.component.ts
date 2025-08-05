import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

import { EventModel } from '../types/event.model';
import { EventService } from '../services/event.service';

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
	providers: [EventService, ActivityService],
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
	constructor(private calendarService: EventService,
		private activityService: ActivityService) {}

	events: EventModel[] = [];
	activities: ActivityModel[] = [];

	private eventCrud!: CrudHelper<EventModel>;
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
	onSaveEvent(event: EventModel) {
		this.eventCrud.save(event, this.calendarService);
	}
	onDeleteEvent(event: EventModel) {
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
