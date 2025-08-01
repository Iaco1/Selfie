import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { RRule, Options, rrulestr, Weekday } from 'rrule';

import { EventModel } from "../../types/event.model";


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

	showModal = false;
	openModal() {
		this.showModal = true;
	}
	closeModal() {
		this.showModal = false;
	}

	repeatEndMode: 'never' | 'after' | 'until' = 'never';
	interval: number = 1; //default interval is 1
	frequency: "daily" | "weekly" | "monthly" | "yearly" = "weekly"; //Default to a valid RRule frequency
	count: number | undefined;	
	until: Date | undefined;

	ngOnInit(): void {
		if (this.until) this.repeatEndMode = 'until';
		else if (this.count) this.repeatEndMode = 'after';
		else this.repeatEndMode = 'never';
	}

	saveEvent() {
		// 🛡️ Restore the master start/end if this was a generated instance
		if (this.evento.isRecurringInstance && this.evento.originalStartDate) {
			this.evento.start = this.evento.originalStartDate.clone();
			this.evento.end = this.evento.calculateEnd();
		}

		if (this.evento.repeat?.bool) {
			const dateTimeString = `${this.evento.start.date}T${this.evento.start.time}`;
			const dtstart = new Date(dateTimeString);
			const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			const weekdayIndex = dtstart.getDay(); // 0 = Sunday, 1 = Monday...
			const wkst = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA][weekdayIndex];

			const options: Partial<Options> = {
				dtstart,
				freq: FREQ_MAP[this.frequency],
				interval: this.interval || 1,
				wkst
			};

			if (this.repeatEndMode === 'after') {
				options.count = this.count;
			} else if (this.repeatEndMode === 'until') {
				options.until = new Date(this.until!);
			}

			// Manually build the full RRule string
			const rrule = new RRule(options);

			// Format DTSTART with timezone
			const pad = (n: number) => n.toString().padStart(2, '0');
			const localDate = `${dtstart.getFullYear()}${pad(dtstart.getMonth() + 1)}${pad(dtstart.getDate())}`;
			const localTime = `${pad(dtstart.getHours())}${pad(dtstart.getMinutes())}${pad(dtstart.getSeconds())}`;
			const dtstartStr = `DTSTART;TZID=${timeZone}:${localDate}T${localTime}`;

			const fullRRule = `${dtstartStr}\n${rrule.toString().split('\n').filter(l => !l.startsWith('DTSTART')).join('\n')}`;

			// Validate
			try {
				rrulestr(fullRRule);
				this.evento.repeat.rrule = fullRRule;
			} catch (e) {
				console.error("Invalid RRule:", fullRRule, e);
				alert("Error: invalid recurrence rule");
				return;
			}
		} else {
			// Se il checkbox è disattivo, rimuoviamo tutta la logica repeat
			this.evento.repeat = { bool: false };
		}
		
		// Salva l’evento e chiudi il modale
		this.save.emit(this.evento);
		this.closeModal();
	}

	deleteEvent() {
		this.delete.emit(this.evento);
		this.closeModal();
	}

	getCornerClasses(): string {
		return "rounded-"+this.cornerMask;
	}
}
