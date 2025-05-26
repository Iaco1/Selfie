export class CalendarEvent {
	id : number;
	title : string;
	description? : string;
	start : Date; // e.g., 2025-05-07T09:00:00
	end : Date;   // e.g., 2025-05-08T12:00:00
	colour? : string;

	constructor(start: Date, durationInHour: number = 1, colour: string = "blue",
		title: string = "New Event", description:string="") {
		this.id = Date.now(), // id temporaneo
		this.title = title;
		this.start = new Date(start);
		this.end = new Date(start.getTime() + durationInHour * 60 * 60 * 1000);
		this.colour = colour;
		this.description = description;
	}
}
