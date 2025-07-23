import { StringDate } from "./string-date";

export class NoteModel {
	_id: string = "";
	title: string;
	author: string;
	text: string;
	tags: string[];
	creation: StringDate;
	lastModification: StringDate;

	constructor(title: string="", author: string="author", text: string="", tags: string[] = []) {
		this.title = title;
		this.author = author;
		this.text = text;
		this.tags = tags;
		let creationDate = new Date()
		//this.id = creationDate.getTime();
		this.creation = StringDate.fromDate(creationDate);
		this.lastModification = this.creation.clone();
	}
}
