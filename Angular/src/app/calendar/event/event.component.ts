import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../../types/calendar-event.model';

@Component({
	selector: 'event',
	imports: [CommonModule, FormsModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.css'
})
export class EventComponent {
	@Input() evento!: CalendarEvent;
	@Output() save = new EventEmitter<CalendarEvent>();
	@Output() delete = new EventEmitter<CalendarEvent>();

	showModal = false;
	openModal() {
		this.showModal = true;
	}
	closeModal() {
		this.showModal = false;
	}

	saveEvent() {
		this.save.emit(this.evento);
		this.closeModal();
	}
	deleteEvent() {
		this.delete.emit(this.evento);
		this.closeModal();
	}
}
