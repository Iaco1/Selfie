import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { RRule, Weekday, Options, rrulestr, RRuleSet } from 'rrule';

import { EventModel } from "../../types/event.model";
import { EventService } from "../../services/event.service";
import { StringDate } from "../../types/string-date";
import { fromLocalDateString, toLocalDateString } from "../../utils/date";

const WEEKDAY_MAP: { [key: string]: Weekday } = {
	MO: RRule.MO,
	TU: RRule.TU,
	WE: RRule.WE,
	TH: RRule.TH,
	FR: RRule.FR,
	SA: RRule.SA,
	SU: RRule.SU
};

const FREQ_MAP = {
	daily: RRule.DAILY,
	weekly: RRule.WEEKLY,
	monthly: RRule.MONTHLY,
	yearly: RRule.YEARLY
} as const;

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
		private router: Router
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
		// 🛡️ Restore the master start/end if this was a generated instance
		if (this.me.isRecurringInstance && this.me.originalStartDate) {
			this.me.start = this.me.originalStartDate.clone();
			this.me.calculateEnd();
		}

		this.generateRRule();

		//console.log("Event to be saved:", JSON.stringify(this.me, null, 2));
		if (!this.me._id) {
			// Create new event
			this.eventService.create(this.me).subscribe({
				next: (createdEvent) => {
					this.me = createdEvent;
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
			const dateTimeString = `${this.me.start.date}T${this.me.start.time}`;
			const dtstart = new Date(dateTimeString); // 👈 treat as local time, no UTC

			const options: Partial<Options> = {
				dtstart: dtstart,
				freq: FREQ_MAP[this.frequency],
				interval: this.interval || 1,
			};

			if (this.repeatEndMode === 'after') {
				options.count = this.count;
			} else if (this.repeatEndMode === 'until') {
				const untilDate = new Date(this.until + 'T23:59:59'); // still local
				options.until = untilDate;
			}

			if (this.frequency === 'monthly' && this.byweekday.length && this.bysetpos.length) {
				options.byweekday = this.byweekday.flatMap((day: string) =>
					this.bysetpos.map(pos => WEEKDAY_MAP[day].nth(pos))
				);
			}

			const rrule = new RRule(options);

			const pad = (n: number) => n.toString().padStart(2, '0');
			const dtDate = `${dtstart.getFullYear()}${pad(dtstart.getMonth() + 1)}${pad(dtstart.getDate())}`;
			const dtTime = `${pad(dtstart.getHours())}${pad(dtstart.getMinutes())}${pad(dtstart.getSeconds())}`;
			const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const dtstartStr = `DTSTART;TZID=${userTimeZone}:${dtDate}T${dtTime}`;

			const fullRRule = `${dtstartStr}\n${rrule.toString().split('\n').filter(l => !l.startsWith('DTSTART')).join('\n')}`;
			//console.log("RRULE string:", fullRRule);
			try {
				rrulestr(fullRRule); // Validate it
				this.me.repeat.rrule = fullRRule;
			} catch (e) {
				console.error("Invalid RRule:", fullRRule, e);
				alert("Error: invalid recurrence rule");
				return;
			}
		} else {
			this.me.repeat = { bool: false };
		}
	}
	private parseRRule() {
		if (this.me.repeat?.rrule) {
			try {
				const rule = rrulestr(this.me.repeat.rrule, { forceset: true }) as RRuleSet;
				const r = rule.rrules()[0];
				const options = r.origOptions;

				this.frequency = Object.entries(FREQ_MAP).find(([_, val]) => val === options.freq)?.[0] as any;
				this.interval = options.interval ?? 1;

				this.count = typeof options.count === 'number' ? options.count : undefined;

				if (options.until instanceof Date) {
					const pad = (n: number) => n.toString().padStart(2, '0');
					this.until = `${options.until.getFullYear()}-${pad(options.until.getMonth() + 1)}-${pad(options.until.getDate())}`;
				} else {
					this.until = undefined;
				}

				const rruleLines = this.me.repeat.rrule.split('\n');
				const dtstartLine = rruleLines.find(l => l.startsWith('DTSTART'));
				if (dtstartLine) {
					let match = dtstartLine.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/);
					if (match) {
						const raw = match[1]; // e.g. '20250812T180000'
						const date = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
						const time = `${raw.slice(9,11)}:${raw.slice(11,13)}`;
						this.me.start = new StringDate(date, time);
						this.me.calculateEnd();
						//console.log("Parsed from raw DTSTART:", date, time);
					}
				}

				this.setMode();

				this.byweekday = [];
				this.bysetpos = [];

				if (Array.isArray(options.byweekday)) {
					for (const wd of options.byweekday) {
						if (typeof wd === 'object' && wd.weekday !== undefined) {
							const dayKey = Object.keys(WEEKDAY_MAP).find(key => WEEKDAY_MAP[key].weekday === wd.weekday);
							if (dayKey) {
								if (!this.byweekday.includes(dayKey)) this.byweekday.push(dayKey);
								if (typeof wd.n === 'number' && !this.bysetpos.includes(wd.n)) this.bysetpos.push(wd.n);
							}
						} else if (typeof wd === 'number') {
							const dayKey = Object.keys(WEEKDAY_MAP).find(key => WEEKDAY_MAP[key].weekday === wd);
							if (dayKey && !this.byweekday.includes(dayKey)) this.byweekday.push(dayKey);
						}
					}
				}
			} catch (e) {
				console.error("Failed to parse saved rrule:", e);
			}
		}
	}

	//helpers for the UI
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
}
