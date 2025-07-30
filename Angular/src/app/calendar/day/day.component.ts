import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventModel } from "../../types/event.model";
import { StringDate } from "../../types/string-date";
import { EventComponent } from "../event/event.component";
import { ActivityComponent } from '../../list-activities/activity/activity.component';
import { ActivityModel } from "../../types/activity.model";

@Component({
	selector: "day",
	imports: [CommonModule, EventComponent, ActivityComponent],
	templateUrl: "./day.component.html",
	styleUrl: "./day.component.css",
	standalone: true
})
export class DayComponent implements OnChanges {
	constructor() {}

	//my datas
	@Input() day!: Date;
	@Input() visualize: string = "";
	@Input() startHour: number = 0;
	@Input() endHour: number = 23;

	//arrays
	@Input() events: EventModel[] = [];
	filteredEvents: EventModel[] = [];

	@Input() activities: ActivityModel[] = []
	filteredActivities: ActivityModel[] = [];

	ngOnChanges(changes: SimpleChanges) {
		if (changes['events'] || changes['day'] || changes['activities'])
			this.filterEventsAndActivities();
	}

	filterEventsAndActivities(): void {
		const startOfDay = new Date(this.day);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(startOfDay);
		endOfDay.setHours(23, 59, 59, 999);

		this.filteredEvents = this.events.filter(event => {
			return event.startDate <= endOfDay && event.endDate >= startOfDay;
		});		
		this.filteredActivities = this.activities.filter(activity => {
			let exp = activity.expirationDAyte;
			return startOfDay <= exp && exp <= endOfDay; // start <= exp <= end
		})
	}

	//style
	getName(): string {
		return this.day.toLocaleString("en-US", { weekday: "long" });
	}
	getCornerMask(event: EventModel, hour?: number): string {
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
			if(this.filteredActivities.length > 0) {
				return this.filteredActivities[0].colour;
			}
			if(this.filteredEvents.length > 0) {
				return this.filteredEvents[0].colour;
			} else { return "black" }
		} else return "";
	}
	
	//hours
	get hours(): number[] {
		const range: number[] = [];
		for (let h = this.startHour; h <= this.endHour; h++) {
			range.push(h);
		}
		return range;
	}
	private hasEventsAtHour(hour: number): EventModel[] {
		const dateHourStart = new Date(this.day);
		dateHourStart.setHours(hour, 0, 0, 0);

		const dateHourEnd = new Date(this.day);
		dateHourEnd.setHours(hour + 1, 0, 0, 0);

		return this.filteredEvents.filter(event =>
			event.startDate < dateHourEnd && event.endDate > dateHourStart
		);
	}

	//more filters
	allDay(event: EventModel): boolean {
		return event.startDate.toDateString() !== event.endDate.toDateString();
	}
	upperEvents(): EventModel[] {
		if (this.visualize === "month" || this.visualize === "year")
			return this.filteredEvents;
		//in week and day show upper only looong events (more than 24 hours)
		return this.filteredEvents.filter(event => this.allDay(event));
	}
	getEventsForHour(hour: number): EventModel[] {
		return this.hasEventsAtHour(hour).filter(event => !this.allDay(event));
	}

	//events
	@Output() saveEvent = new EventEmitter<EventModel>();
	@Output() deleteEvent = new EventEmitter<EventModel>();

	createEvent(hour: number = 0) {
		const dateHour = new Date(this.day);
		dateHour.setHours(hour, 0, 0, 0);
		const newEvent = new EventModel(StringDate.fromDate(dateHour));
		this.saveEvent.emit(newEvent);
	}

	onSaveEvent(updatedEvent: EventModel) {
		this.saveEvent.emit(updatedEvent);
	}

	onDeleteEvent(eventToDelete: EventModel) {
		this.deleteEvent.emit(eventToDelete);
	}

	//activities
	@Output() saveActivity = new EventEmitter<ActivityModel>();
	@Output() deleteActivity = new EventEmitter<ActivityModel>();

	onSaveActivity(updatedActivity: ActivityModel) {
		this.saveActivity.emit(updatedActivity);
	}
	onDeleteActivity(activityToDelete: ActivityModel) {
		this.deleteActivity.emit(activityToDelete);
	}
}

