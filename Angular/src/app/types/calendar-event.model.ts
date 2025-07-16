import { StringDate } from "./string-date";

export class CalendarEvent {
	id : number;
	title : string;
	description? : string;
	start : StringDate; // e.g., {date: '2025-05-07', time: '09:00:00'}
	end : StringDate;   // e.g., {date: '2025-05-08', time: '12:00:00'}
	colour? : string;
	//TODO
	user?: string;
	location?: string;
	repeat?: string;
	notification?: string[];
	pomodoro?: {bool: false, studyFor: string, restFor: string};

	constructor(start: Date, durationInHours: number = 1, colour: string = "blue",
		title: string = "New Event", description:string="") {
		this.id = Date.now(), // id temporaneo
		this.title = title;
		this.colour = colour;
		this.description = description;
		// Convert startDate to { date, time }
		this.start = StringDate.fromDate(start);
		// Compute end date
		const endDate = new Date(start.getTime() + durationInHours * 60 * 60 * 1000);
		this.end = StringDate.fromDate(endDate);
	}

	get startDate() { return this.start.getDate() }
	get endDate() { return this.end.getDate() }
}
