import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PomodoroService } from '../services/pomodoro.service';
import { TimeMachineService } from '../services/time-machine.service';

import { EventService } from '../services/event.service';
import { ActivityService } from '../services/activity.service';
import { EventModel } from '../types/event.model';
import { ActivityModel } from '../types/activity.model';

import { getStartOfWeek, isSameDay } from '../utils/date';
import { generateInstancesInRange, getEventDurationMs } from '../utils/rrule-utils';


@Component({
	selector: 'app-homepage',
	imports: [ DecimalPipe, DatePipe, NgFor, HttpClientModule],
	providers: [EventService, ActivityService],
	templateUrl: './homepage.component.html',
	styleUrl: './homepage.component.css'
})
export class HomepageComponent {
	// last pomodoro recorded data
	lastPomodoro: any;
	startTime = "last pomodoro fetch failed or is yet to happen";
	duration = 0;
	//week datas
	private lastLoadedDay?: Date;
	currentDate!: Date;
	weekStart!: Date;
	weekEnd!: Date;
	//events datas
	weekEvents: EventModel[] = [];
	//activities datas
	weekActivities: ActivityModel[] = [];

	constructor(
		private pomodoroService: PomodoroService,
		private timeMachine: TimeMachineService,
		private eventService: EventService,
		private activityService: ActivityService
	) {
		//displaying the last pomodoro recorded
		this.pomodoroService.get(localStorage.getItem('authToken')!).subscribe({
			next: (response) => {
				console.log("get pomodoros result: ", response);
				this.lastPomodoro = response.pomodoro.at(-1);
				this.startTime = this.lastPomodoro.startTime;
				this.duration = this.lastPomodoro.duration;
			},
			error: (error) => {
				console.log("get pomodoros failed: ", error);
			}
		});
	}
	ngOnInit() {
		this.timeMachine.day$.subscribe(date => {
			this.currentDate = date;
			this.refresh(date);
		});
	}
	private refresh(updated: Date): void {
		if (!this.lastLoadedDay || !isSameDay(updated, this.lastLoadedDay)) {
			this.lastLoadedDay = updated;
			this.weekEventsActivities();
		}
	}
	private weekEventsActivities() {
		this.weekStart = getStartOfWeek(this.currentDate);
		this.weekEnd = new Date(this.weekStart);
		this.weekEnd.setDate(this.weekStart.getDate() + 6); // Monday → Sunday
		this.weekStart.setHours(0, 0, 0, 0);
		this.weekEnd.setHours(23, 59, 59, 999);

		const startMs = this.weekStart.getTime();
		const endMs = this.weekEnd.getTime();

		// Load and filter events (and instances of repeated ones)
		this.eventService.getOnlyMyEvents().subscribe(events => {
			const instances: EventModel[] = [];

			for (const event of events) {
				const durationMs = getEventDurationMs(event);

				if (event.repeat?.rrule) {
					const repeated = generateInstancesInRange(event, this.weekStart, this.weekEnd, durationMs);
					instances.push(...repeated);
				} else {
					const eventStart = event.start.getTime();
					if (eventStart >= this.weekStart.getTime() && eventStart <= this.weekEnd.getTime()) {
						instances.push(event);
					}
				}
			}

			// Optionally sort by start time
			this.weekEvents = instances.sort((a, b) =>
				a.start.getDate().getTime() - b.start.getDate().getTime()
			);
		});

		// Load and filter activities
		this.activityService.getOnlyMyActivities().subscribe(activities => {
			this.weekActivities = activities.filter(a => {
				const exp = a.expirationDay.getTime();
				return exp >= startMs && exp <= endMs;
			});
		});
	}
}
