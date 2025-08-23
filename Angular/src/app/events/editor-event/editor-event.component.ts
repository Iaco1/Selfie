import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';

import { EventModel } from "../../types/event.model";
import { EventService } from "../../services/event.service";
import { StringDate } from "../../types/string-date";
import { fromLocalDateString, toLocalDateString } from "../../utils/date";
import { NotificationModel } from "../../types/notification.interface";
import { generateRRuleFromInput, parseRRule } from "../../utils/rrule-utils";
import { RRule, rrulestr } from "rrule";
import { NotificationHandlerService } from "../../services/notification-handler.service";

const NOTIFICATION_PRESETS: { label: string; minutesBefore: number }[] = [
	{ label: 'at time of event', minutesBefore: 0 },
	{ label: '10 mins before', minutesBefore: 10 },
	{ label: '1 hour before', minutesBefore: 60 },
	{ label: '2 hours before', minutesBefore: 120 },
	{ label: '1 day before', minutesBefore: 1440 }
];

@Component({
	selector: "editor-event",
	imports: [CommonModule, FormsModule, HttpClientModule],
	providers: [EventService],
	templateUrl: "./editor-event.component.html",
	styleUrl: "./editor-event.component.css"
})
export class EditorEventComponent implements OnInit {
	eventId: string | null = null;
	me!: EventModel;
	viewMode!: string;
	
	constructor(
		private route: ActivatedRoute,
		private eventService: EventService,
		private router: Router,
		private handler: NotificationHandlerService
	) {}

	ngOnInit() {
		this.eventId = this.route.snapshot.paramMap.get('id');
		this.viewMode = this.route.snapshot.queryParamMap.get('view') || 'month';

		if (!this.eventId) {
			// Creation mode
			const dateParam = this.route.snapshot.queryParamMap.get('date');
			const startDate = dateParam ? fromLocalDateString(dateParam) : new Date();
			startDate.setHours(0, 0, 0, 0);
			this.me = new EventModel(StringDate.fromDate(startDate));
			return;
		}
		// Edit mode - fetch note from server
		this.eventService.getById(this.eventId).subscribe({
			next: (date) => {
				//console.log('event id: ', this.eventId , ' event:', date);
				this.me = date;
				this.parseRRule();
				this.syncNotifCheckFromModel(); // 👈 Set checkbox state from model
			},
			error: (err) => {
				console.error('Failed to load event:', err);
			}
		});
	}

	goBackToCalendar() {
		const date = this.route.snapshot.queryParamMap.get('date') || toLocalDateString(new Date)

		this.router.navigate(['/calendar'], {
			queryParams: {
				view: this.viewMode,
				date
			}
		});
	}

	//events
	saveEvent() {
		//HANDLE REPEAT
		// 🛡️ Restore the master start/end if this was a generated instance
		if (this.me.isRecurringInstance && this.me.originalStartDate) {
			this.me.start = this.me.originalStartDate.clone();
			this.me.calculateEnd();
		}
		this.generateRRule();

		//HANDLE NOTIFICATIONS
		this.prepareNotifications();

		//SAVE OR UPDATE EVENT
		//console.log("Event to be saved:", JSON.stringify(this.me, null, 2));
		if (!this.me._id) {
			// Create new event
			this.eventService.create(this.me).subscribe({
				next: (createdEvent) => {
					this.me = createdEvent;
					this.handler.triggerRefresh(); // 👈 After create
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Failed to create event:', err);
				}
			});
		} else {
			// Update existing event
			this.eventService.update(this.me._id, this.me).subscribe({
				next: (updatedEvent) => {
					this.me = updatedEvent;
					this.handler.triggerRefresh(); // 👈 After update
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Failed to update event:', err);
				}
			});
		}
	}

	deleteEvent() {
		if (!this.me._id) return;
		if (confirm('Are you sure you want to delete this note?')) {
			this.eventService.delete(this.me._id).subscribe({
				next: () => {
					//console.log('Event deleted successfully.');
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Delete failed:', err);
				}
			});
		}
	}

	// REPEAT
	repeatEndMode: 'never' | 'after' | 'until' = 'never';
	interval: number = 1; //default interval is 1
	frequency: "daily" | "weekly" | "monthly" | "yearly" = "weekly"; //Default to a valid RRule frequency
	count: number | undefined;	
	until: string | undefined; // date string like yyyy-mm-dd
	//complex repeating
	byweekday: string[] = []; //eg. ["TU"]
	bysetpos: number[] = []; //eg. [2, 4]

	//mode ?
	get untilValue(): string {
		return this.until ?? this.me.start.date;
	}

	set untilValue(val: string) {
		this.until = val;
	}

	private setMode(): void {
		if (typeof this.count === 'number' && this.count > 0) {
			this.repeatEndMode = 'after';
			this.until = undefined;
		} else if (this.until && /^\d{4}-\d{2}-\d{2}$/.test(this.until)) {
			this.repeatEndMode = 'until';
			this.count = undefined;
		} else {
			this.repeatEndMode = 'never';
			this.count = undefined;
			this.until = undefined;
		}
		// console.log(this.repeatEndMode + " end mode");
	}

	private generateRRule() {
		if (this.me.repeat?.bool) {
			let rrule = generateRRuleFromInput({
				startDate: this.me.start.date,
				startTime: this.me.start.time,
				frequency: this.frequency,
				interval: this.interval,
				repeatEndMode: this.repeatEndMode,
				count: this.count,
				until: this.until,
				byweekday: this.byweekday,
				bysetpos: this.bysetpos
			})
			if(rrule) {
				//console.log(rrule);
				this.me.repeat.rrule = rrule;
				return;
			} else { console.error("generated RRule is null or undefined");}
		}
		this.me.repeat = { bool: false };
	}
	private parseRRule() {
		if (this.me.repeat?.rrule) {
			let pr = parseRRule(this.me.repeat.rrule);
			if(pr) {
				this.me.start = new StringDate(pr.startDate, pr.startTime);
				this.frequency = pr.frequency as "daily" | "weekly" | "monthly" | "yearly";
				this.interval = pr.interval;
				this.count = pr.count;
				this.until = pr.until;
				this.byweekday = pr.byweekday;
				this.bysetpos = pr.bysetpos;
			} else console.error("error parsing string");
		}
	}

	//helpers for the UI for repetitions
	onWeekdayChange(day: string, checked: boolean) {
		if (checked && !this.byweekday.includes(day)) {
			this.byweekday.push(day);
		} else if (!checked) {
			this.byweekday = this.byweekday.filter(d => d !== day);
		}
	}
	onPosChange(pos: number, checked: boolean) {
		if (checked && !this.bysetpos.includes(pos)) this.bysetpos.push(pos);
		else if (!checked) this.bysetpos = this.bysetpos.filter(p => p !== pos);
	}

	getReadableRepeat(): string | null {
		if (!this.me.repeat?.rrule) return null;
	
		try {
			const rule = rrulestr(this.me.repeat.rrule);
			if (rule instanceof RRule) {
				return rule.toText();
			}
			return "Custom rule";
		} catch (e) {
			console.error("Failed to parse rule:", e);
			return "Invalid repeat rule";
		}
	}

	//NOTIFICATIONS
	notif_check: string[] = [];
	notificationPresets = NOTIFICATION_PRESETS; //for the html

	onNotificationChange(notify: string, checked: boolean) {
		if (checked && !this.notif_check.includes(notify)) {
			this.notif_check.push(notify);
		} else if (!checked) {
			this.notif_check = this.notif_check.filter(n => n != notify)
		}
	}

	prepareNotifications() {
		// Generate NotificationModel[] from notif_check
		if (!this.notif_check.length) {
			// ✅ Unselected all checkboxes — remove all notifications
			console.log("remove notification from backend")
			this.me.notification = [];
			return;
		}
		// 🧱 Build new notification list
		this.me.notification = this.notif_check.map((label): NotificationModel => {
			const preset = NOTIFICATION_PRESETS.find(p => p.label === label);
			const minutesBefore = preset?.minutesBefore ?? 0;
			const notifyDate = new Date(this.me.start.getTime() - minutesBefore * 60000);
			return {
				id: '', // you can let the backend assign this
				label: label, // ✔️ tells when relative to event
				title: this.me.title,
				message: `Reminder: (${label})`,
				date: notifyDate,
				priority: 1 // Choose appropriate priority
			};
		});
	}
	syncNotifCheckFromModel(): void {
		this.notif_check = [];		
		if (!this.me.notification || !Array.isArray(this.me.notification)) return;
		const validLabels = NOTIFICATION_PRESETS.map(p => p.label);
		for (const notif of this.me.notification) {
			if (validLabels.includes(notif.label) && !this.notif_check.includes(notif.label)) {
				this.notif_check.push(notif.label);
			}
		}
	}
}
