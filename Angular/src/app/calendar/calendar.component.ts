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

import { getStartOfWeek } from '../utils/date-utils';

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
	constructor(private eventService: EventService,
		private activityService: ActivityService) {}

	events: EventModel[] = [];
	activities: ActivityModel[] = [];

	private eventCrud!: CrudHelper<EventModel>;
	private activityCrud!: CrudHelper<ActivityModel>;
	
	ngOnInit(): void {
		this.eventCrud = new CrudHelper(() => this.events, (l) => this.events = l);
		this.activityCrud = new CrudHelper(() => this.activities, (l) => this.activities = l);
	
		this.refreshEvents();	
	
		this.activityService.getOnlyMyActivities().subscribe({
			next: activities => { this.activities = activities;	},
			error: err => console.error('Error loading activities:', err)
		});
	}
	  
	refreshEvents(): void {
		let viewStart: Date;
		let viewEnd: Date;
		const day = new Date(this.day); // clone to avoid mutation
	
		switch (this.dwmy) {
			case 'd':
				viewStart = new Date(day);
				viewStart.setHours(0, 0, 0, 0);
				viewEnd = new Date(day);
				viewEnd.setHours(23, 59, 59, 999);
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
		
	//events
	onSaveEvent(event: EventModel) {
		this.eventCrud.save(event, this.eventService);
		this.refreshEvents(); // <<-- Force re-evaluation
	}
	onDeleteEvent(event: EventModel) {
		this.eventCrud.delete(event, this.eventService);
	}

	//activities
	onSaveActivity(activity: ActivityModel) {
		this.activityCrud.save(activity, this.activityService);
	}
	onDeleteActivity(activity: ActivityModel) {
		this.activityCrud.delete(activity, this.activityService);
	}

	//repeats is true
	generateRecurringInstances(event: EventModel, viewFrom?: Date, viewTo?: Date): EventModel[] {
		const instances: EventModel[] = [];
	
		const startDate = new Date(event.start.date + 'T' + event.start.time);
		const endDate = new Date(event.end.date + 'T' + event.end.time);
		const interval = event.repeat?.interval ?? 1;
		const frequency = event.repeat?.frequency ?? 'weekly';
		const countLimit = event.repeat?.count;
		const untilDate = event.repeat?.until ? new Date(event.repeat.until) : undefined;
	
		let current = new Date(startDate);
		let instanceCount = 0;
	
		while (true) {
			// Stop if 'count' reached
			if (countLimit !== undefined && instanceCount >= countLimit) break;
			// Stop if 'until' date passed
			if (untilDate !== undefined && current > untilDate) break;
			// Stop if current exceeds visible range
			if (viewTo && current > viewTo) break;
	
			// Include only if inside visible range
			if (!viewFrom || current >= viewFrom) {
				const instanceStart = new Date(current);
				const instanceEnd = new Date(instanceStart.getTime() + (endDate.getTime() - startDate.getTime()));
				instances.push(EventModel.fromRecurringInstance(event, instanceStart, instanceEnd));
			}
	
			// Advance
			switch (frequency) {
				case "daily":
					current.setDate(current.getDate() + interval);
					break;
				case "weekly":
					current.setDate(current.getDate() + 7 * interval);
					break;
				case "monthly":
					current.setMonth(current.getMonth() + interval);
					break;
				case "yearly":
					current.setFullYear(current.getFullYear() + interval);
					break;
				default:
					break;
			}
	
			instanceCount++;
		}
	
		return instances;
	}	
}
