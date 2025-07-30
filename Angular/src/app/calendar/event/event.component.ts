import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventModel } from "../../types/event.model";


@Component({
	selector: "event",
	imports: [CommonModule, FormsModule],
	templateUrl: "./event.component.html",
	styleUrl: "./event.component.css"
})
export class EventComponent implements OnInit {
	@Input() evento!: EventModel;
	@Input() cornerMask: string ="none";
	@Output() save = new EventEmitter<EventModel>();
	@Output() delete = new EventEmitter<EventModel>();

	showModal = false;
	openModal() {
		this.showModal = true;
	}
	closeModal() {
		this.showModal = false;
	}

	repeatEndMode: 'never' | 'after' | 'until' = 'never';

	ngOnInit(): void {
		if (this.evento.repeat?.until) this.repeatEndMode = 'until';
		else if (this.evento.repeat?.count) this.repeatEndMode = 'after';
		else this.repeatEndMode = 'never';
	}

	saveEvent() {
		// 🛡️ Restore the master start/end if this was a generated instance
		if (this.evento.isRecurringInstance && this.evento.originalStartDate) {
			this.evento.start = this.evento.originalStartDate.clone();
			this.evento.end = this.evento.calculateEnd(); // Recalculate from duration
		}
		// Solo se l’evento è ripetuto
		let count, until;
		if (this.evento.repeat?.bool) {
			if (this.repeatEndMode === 'after') {
				count = Number(this.evento.repeat.count);
				until = undefined;
			} else if (this.repeatEndMode === 'until') {
				until = this.evento.repeat.until; // già una stringa yyyy-mm-dd
				count = undefined;
			} else { // "never"
				count = undefined;
				until = undefined;
			}
			this.evento.repeat.count = count;
			this.evento.repeat.until = until;
		} else {
			// Se il checkbox è disattivo, rimuoviamo tutta la logica repeat
			this.evento.repeat = {bool: false, frequency: 'weekly', interval: 1, count: undefined, until: undefined };
		}
		
		// Salva l’evento
		this.save.emit(this.evento);
		this.closeModal();
	}
	deleteEvent() {
		this.delete.emit(this.evento);
		this.closeModal();
	}

	getCornerClasses(): string {
		return "rounded-"+this.cornerMask;
	}
}
