import { StringDate } from "./string-date";

export class NoteModel {
	//setted by the program
	_id : string = "";
	author : string;
	//required true
	title : string;
	text : string;
	creation : StringDate;
	lastModification : StringDate;
	//required false
	tags : string[];

	constructor(title: string="", text: string="", author="", tags: string[] = []) {
		this.title = title;
		this.text = text;
		let creationDate = new Date()
		//this.id = creationDate.getTime();
		this.creation = StringDate.fromDate(creationDate);
		this.lastModification = this.creation.clone();
		this.tags = tags;
		if(author) { this.author = author; } else {
			this.author = localStorage.getItem("authToken") || "author";
		}
	}
}
