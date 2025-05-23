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

	calendar_events: CalendarEvent[] = [
		{
			id: 0,
			title: 'Sample Event',
			start: new Date('2025-05-07T09:00:00'),
			end: new Date('2025-05-07T12:00:00'),
			color: 'blue'
		}
		/* i think i should fetch calendar events in calendar not in day,
		event should be a div in a position absolute with
		element = getElement...
		rect = element.getBoundingClientRect()
		then use rect.top, rect.left, rect.right, rect.bottom*/
	];

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

	displayed_events: { event: CalendarEvent; rect: DOMRect }[] = [];
	toggleEvent(hour: number) {
		console.log("day: ", this.day, "hour: ", hour);

		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);

		const cellId = `cell-${this.day.toISOString()}-${hour}`;
		const cellElement = document.getElementById(cellId);

		if (!cellElement) return;

		const rect = cellElement.getBoundingClientRect();

		const newEvent: CalendarEvent = {
			id: Date.now(), // id temporaneo
			title: 'Nuovo Evento',
			description: '',
			start: new Date(dateHour),
			end: new Date(dateHour.getTime() + 60 * 60 * 1000),
			color: 'blue'
		};

		this.displayed_events.push({ event: newEvent, rect });
	}
}
