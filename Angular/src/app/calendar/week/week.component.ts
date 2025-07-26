import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { CalendarEvent } from '../../types/calendar-event.model';
import { ActivityModel } from '../../types/activity.model';

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
	private getStartOfWeek(): Date {
		const today = new Date(this.day);
		const startOfWeek = new Date(today);
		const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
		// If today is Sunday (0), we need to calculate the Monday of the *previous* week
		if (dayOfWeek === 0) {
			// Subtract 6 days from Sunday to get the previous Monday
			startOfWeek.setDate(today.getDate() - 6 );
		} else {
			// Otherwise, subtract the days to get the current week's Monday
			startOfWeek.setDate(today.getDate() - dayOfWeek);
		}
		//console.log('Today:', today.getDate(), 'Start of Week:', startOfWeek.getDate());
		return startOfWeek;
	}
	createWeek() {
		const start = this.getStartOfWeek()
		this.createDayArray(7, start.getFullYear(), start.getMonth(), start.getDate());
		return this.days;
	}
	
	//events
	@Input() events: CalendarEvent[] = [];
	
	@Output() saveEvent = new EventEmitter<CalendarEvent>();
	@Output() deleteEvent = new EventEmitter<CalendarEvent>();
	onSaveEvent(updatedEvent: CalendarEvent) {
		this.saveEvent.emit(updatedEvent);
	}
	onDeleteEvent(eventToDelete: CalendarEvent) {
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
