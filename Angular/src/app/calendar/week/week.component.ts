import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { EventModel } from '../../types/event.model';
import { ActivityModel } from '../../types/activity.model';

import { getStartOfWeek } from '../../utils/date-utils';

@Component({
	selector: 'week',
	imports: [DayComponent],
	templateUrl: './week.component.html',
	styleUrl: './week.component.css'
})
export class WeekComponent {
	@Input() day!: Date;
	days: { id: number; date: Date }[] = [];
	private createDayArray(length: number, year: number, month: number, start: number) {
		this.days = Array.from({ length: length }, (_, i) => ({
			id: i + 1,                        // id: (1-7)
			date: new Date(year, month, start + i + 1)  // real Date object
		}));
		//console.log(this.days);
	}

	createWeek() {
		const start = getStartOfWeek(this.day);
		this.createDayArray(7, start.getFullYear(), start.getMonth(), start.getDate());
		return this.days;
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
