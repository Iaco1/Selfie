import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { RRule, Weekday, Options, rrulestr, RRuleSet } from 'rrule';

import { EventModel } from "../../types/event.model";
import { StringDate } from "../../types/string-date";

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
	selector: "event",
	imports: [CommonModule, FormsModule],
	templateUrl: "./event.component.html",
	styleUrl: "./event.component.css"
})
export class EventComponent implements OnInit {
	@Input() evento!: EventModel;
	@Input() cornerMask: string ="none";
	@Output() save = new EventEmitter<EventModel>();
	@Output() delete = new EventEmitter<EventModel>();

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
		return this.until ?? this.evento.start.date;
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

	parseRRule() {


		if (this.evento.repeat?.rrule) {
			try {
				const rule = rrulestr(this.evento.repeat.rrule, { forceset: true }) as RRuleSet;
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

				const rruleLines = this.evento.repeat.rrule.split('\n');
				const dtstartLine = rruleLines.find(l => l.startsWith('DTSTART'));
				if (dtstartLine) {
					let match = dtstartLine.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/);
					if (match) {
						const raw = match[1]; // e.g. '20250812T180000'
						const date = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
						const time = `${raw.slice(9,11)}:${raw.slice(11,13)}`;
						this.evento.start = new StringDate(date, time);
						this.evento.calculateEnd();
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

	ngOnInit(): void {
		this.parseRRule();
	}

	//open and close modal
	showModal = false;
	openModal() {
		this.showModal = true;
	}

	closeModal() {
		this.showModal = false;
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
		if (!this.evento.repeat?.rrule) return null;
	
		try {
			const rule = rrulestr(this.evento.repeat.rrule);
			if (rule instanceof RRule) {
				return rule.toText();
			}
			return "Custom rule";
		} catch (e) {
			console.error("Failed to parse rule:", e);
			return "Invalid repeat rule";
		}
	}

	//save and delete events
	saveEvent() {
		// 🛡️ Restore the master start/end if this was a generated instance
		if (this.evento.isRecurringInstance && this.evento.originalStartDate) {
			this.evento.start = this.evento.originalStartDate.clone();
			this.evento.end = this.evento.calculateEnd();
		}

		if (this.evento.repeat?.bool) {
			const dateTimeString = `${this.evento.start.date}T${this.evento.start.time}`;
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
			const dtstartStr = `DTSTART;TZID=Europe/Rome:${dtDate}T${dtTime}`;

			const fullRRule = `${dtstartStr}\n${rrule.toString().split('\n').filter(l => !l.startsWith('DTSTART')).join('\n')}`;

			try {
				rrulestr(fullRRule); // Validate it
				this.evento.repeat.rrule = fullRRule;
			} catch (e) {
				console.error("Invalid RRule:", fullRRule, e);
				alert("Error: invalid recurrence rule");
				return;
			}
		} else {
			this.evento.repeat = { bool: false };
		}

		this.save.emit(this.evento);
		this.closeModal();
	}

	deleteEvent() {
		this.delete.emit(this.evento);
		this.closeModal();
	}

	//style helper
	getCornerClasses(): string {
		return "rounded-"+this.cornerMask;
	}
}
