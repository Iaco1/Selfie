import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateselectComponent } from '../dateselect/dateselect.component';
import { TimeMachineService } from '../../services/time-machine.service';
import { forkJoin } from 'rxjs';
import { EventService } from '../../services/event.service';
import { ActivityService } from '../../services/activity.service';
import { NotificationHandlerService } from '../../services/notification-handler.service';
import { HttpClientModule } from '@angular/common/http';
import { isSameDay } from '../../utils/date';

@Component({
	selector: 'timemachine',
	standalone: true,
	imports: [FormsModule, DateselectComponent,	HttpClientModule],
	providers: [EventService, ActivityService],
	templateUrl: './timemachine.component.html',
	styleUrls: ['./timemachine.component.css']
})
export class TimemachineComponent implements OnInit, OnDestroy {
	day!: Date; // ticking "virtual" time
	time : string = "";
	dwmy = "m";
	offsetMs = 0;
	private timer: any;
	private lastLoadedDay?: Date;

	constructor(
		private timeMachine: TimeMachineService,
		private eventService: EventService,
		private activityService: ActivityService,
		private handler: NotificationHandlerService
	) {}

	private pad(n: number): string {
		return n.toString().padStart(2, '0');
	}
	private formatTime(date: Date): string {
		const h = this.pad(date.getHours());
		const m = this.pad(date.getMinutes());
		const s = this.pad(date.getSeconds());
		return `${h}:${m}:${s}`;
	}

	ngOnInit() {
		// Get reference date from the service
		const referenceDate = this.timeMachine.day;
		this.offsetMs = referenceDate.getTime() - Date.now();
		// Start ticking virtual clock
		this.timer = setInterval(() => {
			const newVirtualDay = new Date(Date.now() + this.offsetMs);
			this.timeMachine.setDay(newVirtualDay);
			this.day = newVirtualDay;
		
			this.reloadNotifications(newVirtualDay);
		}, 1000);
		
		this.time = this.formatTime(referenceDate); // 👈 init time
		//if an event is saved in calendar i should re-load notifications
		this.handler.refresh$.subscribe(() => {
			this.loadNotificationsForVirtualDay();
		});
	}
	ngOnDestroy() {
		if (this.timer) clearInterval(this.timer);
	}

	changedDay(newDate: Date) {
		if (!newDate) return;

		const updated = new Date(newDate);
		this.time = this.formatTime(updated);

		this.offsetMs = updated.getTime() - Date.now();
		this.timeMachine.setDay(updated);
		this.day = updated;
		this.reloadNotifications(updated);
	}

	changedDwmy(value: string) {
		this.dwmy = value;
	}

	onTimeChange(newTime: string) {
		if (!newTime) return;
		this.time = newTime;

		const [h, m, s] = newTime.split(":").map(Number);
		const updated = new Date(this.timeMachine.day);
		updated.setHours(h, m, s ?? 0, 0);

		this.offsetMs = updated.getTime() - Date.now();
		this.timeMachine.setDay(updated);
		this.day = updated;
		this.reloadNotifications(updated);
	}
	onTimeInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.onTimeChange(input.value);
	}

	private reloadNotifications(updated: Date): void {
		if (!this.lastLoadedDay || !isSameDay(updated, this.lastLoadedDay)) {
			this.lastLoadedDay = updated;
			this.loadNotificationsForVirtualDay();
		}
	}	
	loadNotificationsForVirtualDay() {
		forkJoin({
			events: this.eventService.getOnlyMyEvents(),
			activities: this.activityService.getOnlyMyActivities()
		}).subscribe({
			next: ({ events, activities }) => {
				this.handler.checkAndScheduleForVirtualDay(
					events,
					activities,
					this.day
				);
			},
			error: err => console.error("Failed to load data for virtual day", err)
		});
	}
}
