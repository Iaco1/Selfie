export interface CalendarEvent {
	id : number;
	title : string;
	description? : string;
	start : Date; // e.g., 2025-05-07T09:00:00
	end : Date;   // e.g., 2025-05-08T12:00:00
	color? : string;
}
