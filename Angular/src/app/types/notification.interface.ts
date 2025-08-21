export type NotificationPriority = 1 | 2 | 3;

export interface NotificationModel {
	//ids
	id: string;
	// Describes the timing of the notification relative to the event start (e.g., "10 mins before")
	label: string;
	//important things
	title: string;
	message: string;
	date: Date;                 // when to notify
	priority: NotificationPriority;
}
