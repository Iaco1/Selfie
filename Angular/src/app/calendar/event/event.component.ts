import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../models/calendar-event.model';

@Component({
	selector: 'event',
	imports: [CommonModule, FormsModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.css'
})
export class EventComponent {
	@Input() evento!: CalendarEvent;
	@Input() rect!: DOMRect | undefined;

	showModal = false;
	openModal() {
		this.showModal = true;
	}
	closeModal() {
		this.showModal = false;
	}

	save() {
		// salva direttamente o emetti evento, se necessario
		this.closeModal();
	}
}
