import { StringDate } from "./string-date";

export class CalendarEvent {
	//setted by the program
	_id : string = "";
	user : string;
	//required true
	title : string;
	start : StringDate; // e.g., {date: '2025-05-07', time: '09:00:00'}
	end   : StringDate; // e.g., {date: '2025-05-08', time: '12:00:00'}
	//often used but required false
	duration : {number: number, measure: string};
	colour : string;
	//required false
	description? : string;
	//TODO
	location? : string;
	repeat? : {bool: boolean, frequency:string, interval: number};
	notification? : string[];
	pomodoro? : {bool: boolean, studyFor: string, restFor: string};

	constructor(
		start: StringDate, end: StringDate | null = null,
		duration: {number:number, measure: string} = {number: 1, measure: "hours"},
		title: string = "New Event", description:string="", colour: string = "blue",
		user: string = ""
	) {
		this.title = title;
		this.colour = colour;
		this.description = description;
		this.start = start;
		this.duration = duration;
		if (user) { this.user = user; } else {
			this.user = localStorage.getItem("authToken") || "user";
		}
		if (end) { this.end = end; } else { this.end = this.calculateEnd(); }
	}

	get startDate() { return this.start.getDate() }
	get endDate() { return this.end.getDate() }

	calculateEnd() : StringDate {
		let duration = 0;
		const a_min = 60 * 1000, a_hour = 60 * a_min, a_day = 24 * a_hour, a_week = 7 * a_day;
		switch(this.duration.measure) {
			case "15min": duration = 15 * a_min; break;
			case "hours": duration = a_hour;     break;
			case "days":  duration = a_day;      break;
			case "weeks": duration = a_week;     break;
		}
		const endDate = new Date(this.start.getTime() + this.duration.number * duration - 1);
		return this.end = StringDate.fromDate(endDate);
	}
	setId(id: string) {
		this._id = id;
	}

	//facoltativi anche su mongoDB
	setLocation     (location: string)       { this.location = location; }
	setNotification (notification: string[]) { this.notification = notification; }
	setPomodoro     (b: boolean, study:string, rest:string) {
		this.pomodoro = { bool: b, studyFor: study, restFor: rest }
	}
}
