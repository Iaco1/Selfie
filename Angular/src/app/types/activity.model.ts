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
	//TODO

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
}
