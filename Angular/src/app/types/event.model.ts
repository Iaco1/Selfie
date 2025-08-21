import { StringDate } from "./string-date";

const a_min = 60 * 1000, a_hour = 60 * a_min, a_day = 24 * a_hour, a_week = 7 * a_day;

export class EventModel {
	//setted by the program
	_id : string = "";
	user : string;
	//start - duration - end
	start : StringDate; // e.g., {date: '2025-05-07', time: '09:00'}
	end   : StringDate; // e.g., {date: '2025-05-08', time: '12:00'}
	duration : {number: number, measure: string};
	//fields
	title : string;
	colour : string;
	description? : string;
	location? : string;
	//TODO
	repeat : {bool: boolean, rrule?: string};
	notification? : string[];
	pomodoro? : {bool: boolean, studyFor: string, restFor: string};

	constructor(
		start: StringDate, end: StringDate | null = null,
		duration: {number:number, measure: string} = {number: 1, measure: "hours"},
		title: string = "", colour: string = "blue", description:string="",
		location: string = "", user: string = "",
		repeat: {bool: boolean,	rrule: string | undefined } = {bool: false, rrule: undefined }
	) {
		this.start = start;
		this.duration = duration;
		if (end) { this.end = end; } else { this.end = this.calculateEnd(); }
		this.title = title;
		this.colour = colour;
		this.description = description;
		this.location = location;
		this.repeat = repeat;
		if (user) { this.user = user; } else {
			this.user = localStorage.getItem("authToken") || "user";
		}
	}

	get startDate() { return this.start.getDate() }
	get endDate() { return this.end.getDate() }

	calculateEnd() : StringDate {
		let duration = 0;
		switch(this.duration.measure) {
			case "min":   duration = a_min;      break;
			case "15min": duration = 15 * a_min; break;
			case "30min": duration = 30 * a_min; break;
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

	//in order to handle repeatable events
	isRecurringInstance: any;
	originalStartDate: any;
	//repeats
	static fromRecurringInstance( master: EventModel,
		start: StringDate, end: StringDate): EventModel {

		const clone = new EventModel( start, end, master.duration,
			master.title, master.colour,master.description ?? "", master.location, master.user);

		// Optional fields
		clone._id = master._id;
		clone.repeat = master.repeat;
		clone.notification = master.notification;
		clone.pomodoro = master.pomodoro;

		// Recurrence tracking
		clone.originalStartDate = master.start.clone();
		clone.isRecurringInstance = true;

		return clone;
	}
}
