import { Component, Input } from '@angular/core';
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
	@Input() startHour: number = 9;
	@Input() endHour: number = 18;

	calendar_events: CalendarEvent[] = [];

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

//	displayed_events: { event: CalendarEvent; rect: DOMRect }[] = [];

	toggleEvent(hour: number) {
		console.log("day: ", this.day, "hour: ", hour);
/*
		const cellId = `cell-${this.day.toISOString()}-${hour}`;
		const cellElement = document.getElementById(cellId);
		if (!cellElement) return;

		const rect = cellElement.getBoundingClientRect();
*/
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		const newEvent = new CalendarEvent(dateHour);

//		this.displayed_events.push({ event: newEvent, rect });
		this.calendar_events.push(newEvent);
	}
}
