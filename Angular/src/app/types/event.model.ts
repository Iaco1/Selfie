import { StringDate } from "./string-date";

export class EventModel {
//setted by the program
	_id : string = "";
	user : string;
//required true
	title : string;
	start : StringDate; // e.g., {date: '2025-05-07', time: '09:00:00'}
	end   : StringDate; // e.g., {date: '2025-05-08', time: '12:00:00'}
//  often used but required false
	duration : {number: number, measure: string};
	colour : string;
//required false
	description? : string;
	location? : string;
	//repeats
	repeat : {
		bool: boolean,
		frequency: string,
		interval: number,
		count: number | undefined,
		until: string | undefined
	};
	originalStartDate? : StringDate;
	isRecurringInstance? : boolean;
	//TODO
	notification? : string[];
	pomodoro? : {bool: boolean, studyFor: string, restFor: string};

	constructor(
		start: StringDate, end: StringDate | null = null,
		duration: {number:number, measure: string} = {number: 1, measure: "hours"},
		title: string = "New Event", description:string="", colour: string = "blue", user: string = "",
		repeat: {bool: boolean,	frequency:string, interval: number, count: number|undefined, until: string|undefined }
			= {bool: false, frequency: 'weekly', interval: 1, count: undefined, until: undefined }
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
		//repeat
		this.repeat = repeat;
	}

	get startDate() { return this.start.getDate() }
	get endDate() { return this.end.getDate() }

	calculateEnd() : StringDate {
		let duration = 0;
		const a_min = 60 * 1000, a_hour = 60 * a_min, a_day = 24 * a_hour, a_week = 7 * a_day;
		switch(this.duration.measure) {
			case "min":   duration = a_min;      break;
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

	//repeats
	static fromRecurringInstance( master: EventModel,
		instanceStart: Date, instanceEnd: Date): EventModel {

		const start = StringDate.fromDate(instanceStart);
		const end = StringDate.fromDate(instanceEnd);
		
		const clone = new EventModel( start, end, master.duration,
			master.title, master.description ?? "",	master.colour, master.user);
		
		// Optional fields
		clone._id = master._id;
		clone.location = master.location;
		clone.repeat = master.repeat;
		clone.notification = master.notification;
		clone.pomodoro = master.pomodoro;
		
		// Recurrence tracking
		clone.originalStartDate = master.start.clone();
		clone.isRecurringInstance = true;
		
		return clone;
	}
}
