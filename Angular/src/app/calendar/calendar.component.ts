import { Component, OnInit } from '@angular/core';

import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

import { CalendarEvent } from '../types/calendar-event.model';
import { HttpClientModule } from '@angular/common/http';
import { CalendarService } from '../services/calendar.service';

@Component({
	selector: 'calendar',
	imports: [
		DateselectComponent,
		MonthComponent,
		DayComponent,
		WeekComponent,
		HttpClientModule
	],
	providers: [CalendarService],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

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
	constructor(private calendarService: CalendarService) {}

	ngOnInit(): void {
		this.calendarService.getAll().subscribe({
			next: events => this.events = events,
			error: err => console.error('Error loading events:', err)
		});
	}
	
	private notice(event: CalendarEvent) {
		const i = this.events.findIndex(e => e._id === event._id);
		if (i !== -1) {
			this.events[i] = event;
		} else {
			this.events = [...this.events, event]; // ⏎ triggers ngOnChanges in children
		}
	}
	onSaveEvent(event: CalendarEvent) {
		const op$ = event._id
			? this.calendarService.update(event._id, event)
			: this.calendarService.create(event);
	
		op$.subscribe(savedEvent => this.notice(savedEvent)); // ✅ reuseable
	}
	
	onDeleteEvent(eventToDelete: CalendarEvent) {
		if (!eventToDelete._id) return;
	
		this.calendarService.delete(eventToDelete._id).subscribe(() => {
			this.events = this.events.filter(event => event._id !== eventToDelete._id);
		});
	}
}
