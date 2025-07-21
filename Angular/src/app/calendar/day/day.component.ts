import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarEvent } from "../../types/calendar-event.model";
import { EventComponent } from "../event/event.component";
import { StringDate } from "../../types/string-date";

@Component({
	selector: "day",
	imports: [CommonModule, EventComponent],
	templateUrl: "./day.component.html",
	styleUrl: "./day.component.css",
	standalone: true
})
export class DayComponent implements OnChanges {
	constructor() {}

	@Input() day!: Date;
	@Input() visualize: string = "";
	@Input() startHour: number = 0;
	@Input() endHour: number = 23;

	@Input() events: CalendarEvent[] = [];

	filteredEvents: CalendarEvent[] = [];

	ngOnChanges(changes: SimpleChanges) {
		//if (changes['day'] || changes['events']) {}
		this.filterEvents();
	}

	filterEvents(): void {
		const startOfDay = new Date(this.day);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(startOfDay);
		endOfDay.setHours(23, 59, 59, 999);

		this.filteredEvents = this.events.filter(event => {
			return event.startDate <= endOfDay && event.endDate >= startOfDay;
		});
	}

	allDay(event: CalendarEvent): boolean {
		return event.startDate.toDateString() !== event.endDate.toDateString();
	}

	getCornerMask(event: CalendarEvent, hour?: number): string {
		const isStart = event.startDate.toDateString() === this.day.toDateString();
		const isEnd = event.endDate.toDateString() === this.day.toDateString();

		if (hour !== undefined) {
			const eventStartHour = event.startDate.getHours();
			const eventEndHour = event.endDate.getHours();

			const isTop = isStart && hour === eventStartHour;
			const isBottom = isEnd && hour === eventEndHour - 1;

			if (isTop && isBottom) return "all";
			if (isTop) return "top";
			if (isBottom) return "bottom";
			return "none";
		}

		if (isStart && isEnd) return "all";
		if (isStart) return "left";
		if (isEnd) return "right";

		return "none";
	}
	classMonth(): string {
		if(this.visualize == "month") { return "number_of_month"} else return "";
	}
	getBackgroundColour(): string {
		if(this.visualize == "year") {
			if(this.filteredEvents.length > 0) {
				return this.filteredEvents[0].colour;
			} else { return "black" }
		} else return "";
	}

	getName(): string {
		return this.day.toLocaleString("en-US", { weekday: "long" });
	}

	get hours(): number[] {
		const range: number[] = [];
		for (let h = this.startHour; h <= this.endHour; h++) {
			range.push(h);
		}
		return range;
	}

	private hasEventsAtHour(hour: number): CalendarEvent[] {
		const dateHourStart = new Date(this.day);
		dateHourStart.setHours(hour, 0, 0, 0);

		const dateHourEnd = new Date(this.day);
		dateHourEnd.setHours(hour + 1, 0, 0, 0);

		return this.filteredEvents.filter(event =>
			event.startDate < dateHourEnd && event.endDate > dateHourStart
		);
	}

	getEventsForHour(hour: number): CalendarEvent[] {
		return this.hasEventsAtHour(hour).filter(event => !this.allDay(event));
	}

	@Output() saveEvent = new EventEmitter<CalendarEvent>();
	@Output() deleteEvent = new EventEmitter<CalendarEvent>();

	createEvent(hour: number = 0) {
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		const newEvent = new CalendarEvent(StringDate.fromDate(dateHour));
		this.saveEvent.emit(newEvent);
	}

	onSaveEvent(updatedEvent: CalendarEvent) {
		this.saveEvent.emit(updatedEvent);
	}

	onDeleteEvent(eventToDelete: CalendarEvent) {
		this.deleteEvent.emit(eventToDelete);
	}
}

