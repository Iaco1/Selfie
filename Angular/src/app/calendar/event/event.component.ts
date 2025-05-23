import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'event',
	imports: [CommonModule, FormsModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.css'
})
export class EventComponent {
	@Input() visible = false;
	@Input() event: any = { title: '', description: '' };
	@Output() onSave = new EventEmitter<any>();
	@Output() onClose = new EventEmitter<void>();

	close() {
	this.onClose.emit();
	}

	save() {
	this.onSave.emit(this.event);
	this.close();
	} 
	/*
	@Input() visualize: string = "";

	event = {
		id: 'mongoDB choose me :P',
		info: {
			note: 'go to luigi',
			description: "go to luigi's house at 10",
			location: "luigi's house",
			colour: 'green',
			emoji: ':3'
		},
		dateFrom: new Date(),
		dateTo: new Date(),
		who: [
			{ id: 0, name: 'its me Mario!' },
			{ id: 1, name: 'Toad' }
		],
		repeat: [
			{ id: 0, time: '5 min' },
			{ id: 1, time: '1 hour' },
			{ id: 2, time: '1 day' },
			{ id: 3, time: '2 day' },
			{ id: 4, time: '1 week' }
		],
	};

	infos: any[] = [];

	constructor() {
		this.infos = Object.entries(this.event.info)
			.map(([key, value], index) =>
			({
				id: index,
				name: key,
				value: value,
				hidden: true,
				icon: ""
			}));
		//add icons to the description
		let i: any;
		if (i = this.infos.find(info => info.name === "description")) {	i.icon = "clipboard"; }
		if (i = this.infos.find(info => info.name === "location")) { i.icon = "location-dot"; }
		if (i = this.infos.find(info => info.name === "emoji")) { i.icon = "face-smile"; }
		//console.log(this.infos);
	}

	toggle(info: any) {
		info.hidden = !info.hidden;
	}

	edit(info: any) {
		info.hidden = true;
		// This is the assertion TypeScript needs:
		this.event.info[info.name as keyof typeof this.event.info] = info.value;
	}

	trackById(index: number, item: any) {
		return item.id;
	}

	editDateFrom() {
		console.log('edit date from not implemented yet');
	}

	editDateTo() {
		console.log('edit date to   not implemented yet');
	}*/
}
