export class StringDate {
	date: string; // e.g., '2025-05-07'
	time: string; // e.g., '18:00'

	constructor(date: string, time: string) {
		this.date = date;
		this.time = time;
	}

	getDate(): Date {
		const [hour, minute] = this.time.split(':').map(Number);
		const [year, month, day] = this.date.split('-').map(Number);
		return new Date(year, month - 1, day, hour, minute); // ✅ Local time
	}

	getTime(): number {
		return this.getDate().getTime();
	}

	static fromDate(dateObj: Date): StringDate {
		const pad = (n: number) => n.toString().padStart(2, '0');
		const date = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
		const time = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
		return new StringDate(date, time);
	}

	clone(): StringDate {
		return new StringDate(this.date, this.time);
	}
}
