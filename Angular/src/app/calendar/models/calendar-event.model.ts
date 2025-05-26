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

	get startString(): string {
		return this.toDatetimeLocal(this.start);
	}
	
	set startString(value: string) {
		this.start = new Date(value);
	}
	
	get endString(): string {
		return this.toDatetimeLocal(this.end);
	}
	
	set endString(value: string) {
		this.end = new Date(value);
	}
	
	private toDatetimeLocal(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
}
