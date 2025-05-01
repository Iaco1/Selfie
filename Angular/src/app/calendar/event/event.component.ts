import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-event',
	imports: [CommonModule, FormsModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.css'
})
export class EventComponent {
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
	]
	};

	infos: any[] = [];

	constructor() {
		this.infos = Object.entries(this.event.info)
			.map(([key, value], index) =>
			({
				id: index,
				name: key,
				value: value,
				hidden: true
			}));
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
	}
}
