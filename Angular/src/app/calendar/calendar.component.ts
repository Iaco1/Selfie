import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { rrulestr } from 'rrule';

import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

import { EventModel } from '../types/event.model';
import { EventService } from '../services/event.service';

import { ActivityModel } from '../types/activity.model';
import { ActivityService } from '../services/activity.service';
import { CrudHelper } from '../utils/crud-helper';
import { getStartOfWeek } from '../utils/date';
import { StringDate } from '../types/string-date';
import { NotificationHandlerService } from '../services/notification-handler.service';
import { forkJoin } from 'rxjs';

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
		this.refreshEvents(); // Re-generate based on new view
	}

	dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
		this.refreshEvents(); //changed the limit of the generation -> regenerate
	}
	createRange(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i + 1);
	}

	//events and activities uses crudHelper :D
	constructor(
		private eventService: EventService,
		private activityService: ActivityService,
		private handler: NotificationHandlerService) {}

	events: EventModel[] = [];
	activities: ActivityModel[] = [];

	private activityCrud!: CrudHelper<ActivityModel>;

	ngOnInit(): void {
		this.activityCrud = new CrudHelper(() => this.activities, (l) => this.activities = l);
		this.refreshEvents();

		forkJoin({
			events: this.eventService.getOnlyMyEvents(),
			activities: this.activityService.getOnlyMyActivities()
		}).subscribe({
			next: ({ events, activities }) => {
				this.activities = activities;
				this.events = events.flatMap(event =>
					event.repeat?.bool
						? this.generateRecurringInstances(event, this.day, this.day) // or use proper range
						: [event]
				);

				this.handler.loadNotifications(this.events, this.activities);
			},
			error: err => console.error('Error loading events or activities:', err)
		});
	}

	//activities
	onSaveActivity(activity: ActivityModel) {
		this.activityCrud.save(activity, this.activityService);
	}
	onDeleteActivity(activity: ActivityModel) {
		this.activityCrud.delete(activity, this.activityService);
	}

	//repeats is true
	refreshEvents(): void {
		let viewStart: Date;
		let viewEnd: Date;
		const day = new Date(this.day); // clone to avoid mutation
	
		switch (this.dwmy) {
			case 'd':
				viewStart = new Date(day);
				viewEnd = new Date(day);
				break;
			case 'w': {
				viewStart = getStartOfWeek(day);
				viewEnd = new Date(viewStart);
				viewEnd.setDate(viewStart.getDate() + 6); // Monday → Sunday
				break;
			}
			case 'm':
				viewStart = new Date(day.getFullYear(), day.getMonth(), 1);
				viewEnd = new Date(day.getFullYear(), day.getMonth() + 1, 0);
				break;
			case 'y':
				viewStart = new Date(day.getFullYear(), 0, 1);
				viewEnd = new Date(day.getFullYear(), 11, 31);
				break;
			default:
				viewStart = new Date(day);
				viewEnd = new Date(day);
		}

		viewStart.setHours(0, 0, 0, 0);
		viewEnd.setHours(23, 59, 59, 999);

		this.eventService.getOnlyMyEvents().subscribe({
			next: events => {
				this.events = events.flatMap(event =>
					event.repeat?.bool
						? this.generateRecurringInstances(event, viewStart, viewEnd)
						: [event]
				);
			},
			error: err => console.error('Error loading events:', err)
		});
	}

	private toLocalFromUTC(d: Date): Date {
		return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
	}

	private generateRecurringInstances(event: EventModel, viewFrom?: Date, viewTo?: Date): EventModel[] {
		//console.log("generate Recurring Instances")
		if (!event.repeat.rrule) return [event];

		const rule = rrulestr(event.repeat.rrule);

		const between = rule.between(viewFrom ?? new Date(0), viewTo ?? new Date(8640000000000000));
		const duration = new Date(`${event.end.date}T${event.end.time}`).getTime() -
						new Date(`${event.start.date}T${event.start.time}`).getTime();

		return between.map(occurrenceStart => {
			const localStart = this.toLocalFromUTC(occurrenceStart);
			const occurrenceEnd = new Date(localStart.getTime() + duration);
		
			return EventModel.fromRecurringInstance(
				event,
				StringDate.fromDate(localStart),
				StringDate.fromDate(occurrenceEnd)
			);
		});
		
	}
}
