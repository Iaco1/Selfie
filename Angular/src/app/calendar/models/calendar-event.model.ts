export class CalendarEvent {
	id : number;
	title : string;
	description? : string;
	start : {date: string, time:string}; // e.g., {date: '2025-05-07', time: '09:00:00'}
	end : {date: string, time:string};   // e.g., {date: '2025-05-08', time: '12:00:00'}
	colour? : string;

	constructor(start: Date, durationInHours: number = 1, colour: string = "blue",
		title: string = "New Event", description:string="") {
		this.id = Date.now(), // id temporaneo
		this.title = title;
		this.colour = colour;
		this.description = description;
		// Convert startDate to { date, time }
		this.start = this.splitDateTime(start);
		// Compute end date
		const endDate = new Date(start.getTime() + durationInHours * 60 * 60 * 1000);
		this.end = this.splitDateTime(endDate);
	}

	get startDate() { return new Date(`${this.start.date}T${this.start.time}`); }
	get endDate() { return new Date(`${this.end.date}T${this.end.time}`); }

	splitDateTime(dateObj: Date): { date: string; time: string } {
		const pad = (n: number) => n.toString().padStart(2, '0');
	
		const year = dateObj.getFullYear();
		const month = pad(dateObj.getMonth() + 1); // getMonth() is 0-based
		const date = pad(dateObj.getDate());
		const hours = pad(dateObj.getHours());
		const minutes = pad(dateObj.getMinutes());
	
		return {
			date: `${year}-${month}-${date}`,
			time: `${hours}:${minutes}`
		};
	}
}
