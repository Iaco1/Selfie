import { StringDate } from "./string-date";

export class NoteModel {
	id: number;
	title: string;
	length?: number;
	text: string;
	tags: string[];
	creation: StringDate;
	lastModification: StringDate;

	constructor(title: string, text: string="", tags: string[] = []) {
		this.title = title;
		this.text = text;
		this.tags = tags;
		let creationDate = new Date()
		this.id = creationDate.getTime();
		this.creation = StringDate.fromDate(creationDate);
		this.lastModification = this.creation.clone();
	}
}
