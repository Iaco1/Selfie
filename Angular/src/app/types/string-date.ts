import { fromLocalDateString, toLocalDateString } from "../utils/date";

export class StringDate {
	date: string; // e.g., '2025-05-07'
	time: string; // e.g., '09:00'

	constructor(date: string, time: string) {
		this.date = date;
		this.time = time;
	}

	getDate(): Date {
		const baseDate = fromLocalDateString(this.date); // uses your safe local parsing
		const [hour, minute] = this.time.split(':').map(Number);
		baseDate.setHours(hour, minute, 0, 0); // set time explicitly
		return baseDate;
	}

	getTime(): number {
		return this.getDate().getTime();
	}

	static fromDate(d: Date): StringDate {
		return new StringDate(
			d.toISOString().split('T')[0],
			d.toTimeString().slice(0, 5)
		);
	}

	static fromRRuleUtcDate(d: Date): StringDate {
		const local = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
		return new StringDate(
			local.toISOString().split('T')[0],
			local.toTimeString().slice(0, 5)
		);
	}

	clone(): StringDate {
		return new StringDate(this.date, this.time);
	}
}
