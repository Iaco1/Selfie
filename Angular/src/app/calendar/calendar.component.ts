import { Component } from '@angular/core';
import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';
import { CalendarEvent } from './models/calendar-event.model';

@Component({
	selector: 'calendar',
	imports: [
		DateselectComponent,
		MonthComponent,
		DayComponent,
		WeekComponent
	],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.css'
})
export class CalendarComponent {
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
	
	onSaveEvent(updatedEvent: CalendarEvent) {
		const index = this.events.findIndex(event => event.id === updatedEvent.id);
		if (index !== -1) {
			this.events[index] = updatedEvent;
		} else {
			this.events.push(updatedEvent);
		}
	}
	
	onDeleteEvent(eventToDelete: CalendarEvent) {
		this.events = this.events.filter(event => event.id !== eventToDelete.id);
	}
}
