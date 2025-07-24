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

	events: CalendarEvent[] = [];
	activities: ActivityModel[] = [];

	constructor(private calendarService: CalendarService,
		private activityService: ActivityService) {}

	ngOnInit(): void {
		this.calendarService.getOnlyMyEvents().subscribe({
			next: events => this.events = events,
			error: err => console.error('Error loading events:', err)
		});
		this.activityService.getOnlyMyActivities().subscribe({
			next: activities => this.activities = activities,
			error: err => console.error('Error loading activities:', err)
		});
	}

	//events
	private noticeEvents(event: CalendarEvent) {
		const i = this.events.findIndex(e => e._id === event._id);
		if (i !== -1) {
			this.events[i] = event;
		} else {
			this.events = [...this.events, event]; // ⏎ triggers ngOnChanges in children
		}
	}
	onSaveEvent(event: CalendarEvent) {
		const op$ = event._id
			? this.calendarService.update(event._id, event)
			: this.calendarService.create(event);
	
		op$.subscribe(savedEvent => this.noticeEvents(savedEvent)); // ✅ reuseable
	}
	
	onDeleteEvent(eventToDelete: CalendarEvent) {
		if (!eventToDelete._id) return;
	
		this.calendarService.delete(eventToDelete._id).subscribe(() => {
			this.events = this.events.filter(event => event._id !== eventToDelete._id);
		});
	}

	//activities
	private noticeActivities(activity: ActivityModel) {
		const i = this.activities.findIndex(e => e._id === activity._id);
		if (i !== -1) {
			this.activities[i] = activity;
		} else {
			this.activities = [...this.activities, activity]; // ⏎ triggers ngOnChanges in children
		}
	}
	onSaveActivity(activity: ActivityModel) {
		const op$ = activity._id
			? this.activityService.update(activity._id, activity)
			: this.activityService.create(activity);
	
		op$.subscribe(savedActivity => this.noticeActivities(savedActivity)); // ✅ reuseable
	}
	
	onDeleteActivity(activityToDelete: ActivityModel) {
		if (!activityToDelete._id) return;
	
		this.activityService.delete(activityToDelete._id).subscribe(() => {
			this.activities = this.activities.filter(activity => activity._id !== activityToDelete._id);
		});
	}
}
