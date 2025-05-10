import { Component, Input } from '@angular/core';
import { CalendarEvent } from '../models/calendar-event.model';
import { EventComponent } from '../event/event.component';

@Component({
	selector: 'day',
	imports: [EventComponent],
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
			title: 'Sample Event',
			start: new Date('2025-05-07T09:00:00'),
			end: new Date('2025-05-07T12:00:00'),
			color: 'blue'
		}
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

	hasEventAtHour(hour: number): boolean {
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		return this.calendar_events.some(event =>
			event.start <= dateHour && event.end > dateHour
		);
	}

	getEventTitle(hour: number): string | null {
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		const event = this.calendar_events.find(e =>
			e.start <= dateHour && e.end > dateHour
		);
		return event ? event.title : null;
	}

	toggleEvent(hour: number): void {
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);

		const index = this.calendar_events.findIndex(event =>
			event.start.getTime() === dateHour.getTime()
		);

		if (index >= 0) {
			this.calendar_events.splice(index, 1); // Remove event at that hour
		} else {
			this.calendar_events.push({
				title: 'New Event',
				start: new Date(dateHour),
				end: new Date(dateHour.getTime() + 60 * 60 * 1000), // 1 hour event
				color: 'blue'
			});
		}
	}
}
