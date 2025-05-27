import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../models/calendar-event.model';
import { EventComponent } from '../event/event.component';

@Component({
	selector: 'day',
	imports: [CommonModule, EventComponent],
	templateUrl: './day.component.html',
	styleUrl: './day.component.css',
	standalone: true
})
export class DayComponent {
	constructor() {}

	@Input() day!: Date;
	@Input() visualize: string = "";
	@Input() startHour: number = 0;
	@Input() endHour: number = 23;

	@Input() events: CalendarEvent[] = [];
	get dayEvents(): CalendarEvent[] {
		const startOfDay = new Date(this.day);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(startOfDay);
		endOfDay.setHours(23, 59, 59, 999);

		return this.events.filter(event =>
			event.startDate >= startOfDay && event.startDate <= endOfDay
		);
	}

	getName() {
		return this.day.toLocaleString('en-US', { weekday: 'long' });
	}

	get hours(): number[] {
		const range: number[] = [];
		for (let h = this.startHour; h <= this.endHour; h++) {
			range.push(h);
		}
		return range;
	}

	createEvent(hour: number = 0) {
		// console.log("day: ", this.day, "hour: ", hour);
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		const newEvent = new CalendarEvent(dateHour);
		this.saveEvent.emit(newEvent);
	}

	hasEventsAtHour(hour: number): CalendarEvent[] {
		const dateHourStart = new Date(this.day);
		dateHourStart.setHours(hour, 0, 0, 0);

		const dateHourEnd = new Date(this.day);
		dateHourEnd.setHours(hour + 1, 0, 0, 0);

		return this.events.filter(event =>
			event.startDate < dateHourEnd && event.endDate > dateHourStart
		);
	}

	@Output() saveEvent = new EventEmitter<CalendarEvent>();
	@Output() deleteEvent = new EventEmitter<CalendarEvent>();
	onSaveEvent(updatedEvent: CalendarEvent) {
		this.saveEvent.emit(updatedEvent);
	}
	onDeleteEvent(eventToDelete: CalendarEvent) {
		this.deleteEvent.emit(eventToDelete);
	}
}
