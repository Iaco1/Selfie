import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-event',
	imports: [CommonModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.css'
})
export class EventComponent {
	//evento Dummy
	event = {
		id: "mongoDB choose me :P",
		note: "go to luigi",
		dateFrom: new Date(),
		dateTo: new Date(),
		description: "go to luigi's house at 10",
		location: "luigi's house",
		who: [
				{id:0, name:"its me Mario!"},
				{id:1, name:"Toad"}
			],
		repeat: [
				{id:0, time:"5 min"},
				{id:1, time:"1 hour"},
				{id:2, time:"1 day"},
				{id:3, time:"2 day"},
				{id:4, time:"1 week"}
			],
		colour: "green",
		emoji: ":3"
	}
	constructor() {};

	editDescription() {
		console.log("edit Description not implemented yet");
	}
	editDateFrom() {
		console.log("edit Date FROM not implemented yet");
	}
	editDateTo() {
		console.log("edit Date TO not implemented yet");
	}
	editLocation() {
		console.log("edit Location not implemented yet");
	}
	editEmoji() {
		console.log("edit Emoji not implemented yet");
	}
}
