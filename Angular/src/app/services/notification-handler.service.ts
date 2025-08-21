import { Injectable } from '@angular/core';
import { NotificationModel } from '../types/notification.interface';
import { NotificationService } from './notification.service';
import { TimeMachineService } from './time-machine.service';
import { EventModel } from '../types/event.model';
import { ActivityModel } from '../types/activity.model';

@Injectable({
	providedIn: 'root'
})
export class NotificationHandlerService {
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
		this.notifications = events.flatMap(event =>
			(event.notification ?? []).map(notification => ({
				...notification,
				title: notification.title || event.title,
				message: notification.message || '',
				date: new Date(notification.date),
				id: `${event._id}_${new Date(notification.date).toISOString()}`
			}))
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
}
