import { Component } from '@angular/core';
import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventComponent } from './event/event.component';

@Component({
	selector: 'calendar',
	imports: [
		DateselectComponent, MonthComponent, DayComponent, WeekComponent,
		EventComponent,	CommonModule, FormsModule

	],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.css'
})
export class CalendarComponent {
	day : Date = new Date();
	changedDay(item: Date) {
		this.day = item;
	}
	dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
	}
	createRange(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i + 1);
	}

	events = [
		{ id: 1, title: 'Compleanno Mario', description: 'Festa a casa di Mario' },
    { id: 2, title: 'Meeting lavoro', description: 'Riunione su Zoom' },
    { id: 3, title: 'Dentista', description: 'Controllo annuale' },
	];
	modalVisible = false;
	selectedEvent = null;

	openModal(event: any) {
		this.selectedEvent = { ...event }; // copia per evitare modifiche dirette
		this.modalVisible = true;
	}

	handleSave(updatedEvent: any) {
	// logica per aggiornare l'evento (es. in un array)
		const index = this.events.findIndex(e => e.id === updatedEvent.id);
		if (index !== -1) {
			this.events[index] = updatedEvent;
		}
		this.modalVisible = false;
	}
}
