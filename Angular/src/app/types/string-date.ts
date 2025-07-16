export class StringDate {
	date: string; // e.g., '2025-05-07'
	time: string; // e.g., '09:00:00'

	constructor(date: string, time: string) {
		this.date = date;
		this.time = time;
	}

	getDate() { return new Date(`${this.date}T${this.time}`); }

	static fromDate(dateObj: Date): StringDate {
		const pad = (n: number) => n.toString().padStart(2, '0');
		//date
		const year = dateObj.getFullYear();
		const month = pad(dateObj.getMonth() + 1);
		const day = pad(dateObj.getDate());
		//time
		const hours = pad(dateObj.getHours());
		const minutes = pad(dateObj.getMinutes());
		const seconds = pad(dateObj.getSeconds());
	
		return new StringDate(`${year}-${month}-${day}`, `${hours}:${minutes}:${seconds}`);
	}

	clone(): StringDate {
		return new StringDate(this.date, this.time);
	}
}
