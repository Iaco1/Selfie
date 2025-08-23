// notification-handler.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationModel } from '../types/notification.interface';
import { NotificationService } from './notification.service';
import { TimeMachineService } from './time-machine.service';
import { EventModel } from '../types/event.model';
import { ActivityModel } from '../types/activity.model';
import { generateInstancesInRange } from '../utils/rrule-utils';
import { isSameDay } from '../utils/date';

@Injectable({
	providedIn: 'root'
})
export class NotificationHandlerService {
	//refresh (so save an event updates notifications)
	private refreshSubject = new Subject<void>();
	refresh$ = this.refreshSubject.asObservable();

	triggerRefresh() {
		this.refreshSubject.next();
	}

	//notifications
	private notifications: NotificationModel[] = [];
	private currentDate!: Date;

	constructor(
		private notificationService: NotificationService,
		private timeMachineService: TimeMachineService
	) {
		this.timeMachineService.day$.subscribe(date => {
			this.currentDate = date;
			this.scheduleNotifications(date); // pass virtual current date
		});
	}

	loadNotifications(events: EventModel[], activities: ActivityModel[]) {
		this.loadNotificationsFromEvents(events);
		this.loadNotificationsFromActivities(activities);		
		if (this.currentDate) {
			this.scheduleNotifications(this.currentDate);
		}
	}

	private loadNotificationsFromActivities(activities: ActivityModel[]) {
		this.notifications.push(
			...activities
				.filter(activity => !activity.completed && activity.expirationDay)
				.map(activity => {
					const date = activity.expirationDay.getDate(); // Date object
					return {
						id: `activity_${activity._id}_${date.toISOString()}`,
						label: 'On expiration',
						title: activity.title,
						message: `Activity expires at ${activity.expirationDay.time}`,
						date: date,
						priority: 2 // medium (1 = low, 2 = medium, 3 = high)
					} satisfies NotificationModel; // optional, for safety
				})
		);
	}

	private loadNotificationsFromEvents(events: EventModel[]) {
		this.notifications.push(
			...events.flatMap(event =>
				(event.notification ?? []).map(notification => ({
					...notification,
					title: notification.title || event.title,
					message: notification.message || '',
					date: new Date(notification.date),
					id: `${event._id}_${new Date(notification.date).toISOString()}`
				}))
			)
		);
	}

	private timeouts = new Map<string, any>();

	scheduleNotifications(currentDate: Date) {
		// Clear existing timeouts
		this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
		this.timeouts.clear();

		this.notifications.forEach(n => {
			const delay = new Date(n.date).getTime() - currentDate.getTime();
			if (delay > 0) {
				const timeoutId = setTimeout(() => this.triggerNotification(n), delay);
				this.timeouts.set(n.id, timeoutId);
			}
		});
	}

	triggerNotification(n: NotificationModel) {
		this.notificationService.runOnSnooze();
		this.notificationService.showNotification(n.title, n.message, true, n.priority);
		// mark as seen or reschedule if repeating
	}

	private dateInDayRange(date: Date, start: Date, end: Date): boolean {
		return date >= start && date <= end;
	}	

	checkAndScheduleForVirtualDay(events: EventModel[], activities: ActivityModel[], virtualDay: Date) {
		//console.log("check and schedule for virtual day");
		this.notifications = []; // reset

		const dayStart = new Date(virtualDay);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(dayStart);
		dayEnd.setHours(23, 59, 59, 999);

		// Add normal event notifications
		this.loadNotificationsFromEvents(
			events.filter(event =>
				event.notification?.some(n => this.dateInDayRange(new Date(n.date), dayStart, dayEnd))
			)
		);
		//console.log("normal events", this.notifications)

		// Add recurring event instances for that day
		const recurringInstances = events.flatMap(event => {
			if (!event.repeat?.bool || !event.repeat.rrule) return [];
		
			const duration = event.end?.getTime() - event.start?.getTime() || 0;
			const instances = generateInstancesInRange(event, dayStart, dayEnd, duration);
			/* DEBUG
			instances.forEach(inst => {
				console.log('Instance start:', inst.start);
				console.log('Notifications:');
				(inst.notification ?? []).forEach(n => {
					console.log(' - Notification date:', new Date(n.date));
					console.log(' - In range:', this.dateInDayRange(new Date(n.date), dayStart, dayEnd));
				});
			});*/
			return instances;
		});

		this.loadNotificationsFromEvents(
			recurringInstances.filter(inst =>
				inst.notification?.some(n => this.dateInDayRange(new Date(n.date), dayStart, dayEnd))
			)
		);
		//console.log("recurring instances", this.notifications)

		// Add activities expiring today
		this.loadNotificationsFromActivities(
			activities.filter(a => a.expirationDay && isSameDay(a.expirationDay.getDate(), virtualDay))
		);
		//console.log("activities", this.notifications)

		this.scheduleNotifications(virtualDay);
	}
}
