import { StringDate } from "./string-date";

export class ActivityModel {
	//setted by the program
	_id : string = "";
	_tempID? : string;
	user : string;
	//required true
	completed: boolean;
	title : string;
	expirationDay : StringDate; // e.g., {date: '2025-05-07', time: '09:00:00'}
	//often used but required false
	colour : string;
	//required false
	description? : string;
	//notification
	priority = 1;

	constructor(
		expirationDay: StringDate, title: string = "New Activity",
		description:string = "", colour: string = "green",
		completed:boolean = false, user: string = ""
	) {
		this.completed = completed;
		this.title = title;
		this.colour = colour;
		this.description = description;
		this.expirationDay = expirationDay;
		if (user) { this.user = user; } else {
			this.user = localStorage.getItem("authToken") || "user";
		}
	}

	get expirationDAyte() { return this.expirationDay.getDate() }

	setId(id: string) {
		this._id = id;
	}

	// ✅ calculate how many seconds it's overdue
	secondsOverdue(now: Date): number {
		if (this.completed) return 0;

		const activityDate = new Date(this.expirationDay.date + 'T' + this.expirationDay.time);
		const diff = now.getTime() - activityDate.getTime();

		return diff > 0 ? Math.floor(diff / 1000) : 0;
	}

	// ✅ move to current day if overdue
	rescheduleIfOverdue(now: Date): void {
		if (this.completed) return;

		const activityDate = new Date(this.expirationDay.date + 'T' + this.expirationDay.time);
		if (activityDate < now) {
			const time = this.expirationDay.time;
			const today = now.toISOString().slice(0, 10);
			this.expirationDay = new StringDate(today, time);
			//add 1 to notification priority
			this.priority = this.priority;
		}
	}
}
