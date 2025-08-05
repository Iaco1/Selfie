import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventModel } from "../../types/event.model";
import { ContrastColourPipe } from "../../utils/contrast-colour.pipe";

@Component({
	selector: "event",
	imports: [CommonModule, FormsModule, ContrastColourPipe],
	templateUrl: "./event.component.html",
	styleUrl: "./event.component.css"
})
export class EventComponent {
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

	saveEvent() {
		this.save.emit(this.evento);
		this.closeModal();
	}
	deleteEvent() {
		this.delete.emit(this.evento);
		this.closeModal();
	}

	//round time
	formatTime(timeStr: string): string {
		let [hourStr, minuteStr] = timeStr.split(':');
		let hour = parseInt(hourStr, 10);
		let minute = parseInt(minuteStr, 10);

		if (minute % 15 !== 0) {
			// round minutes up to next quarter hour
			minute = Math.ceil(minute / 15) * 15;
			//roll over to the next hour
			if (minute === 60) {
				minute = 0;
				hour = (hour + 1) % 24;
			}
		}

		return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
	}
	//style
	getCornerClasses(): string {
		return "rounded-"+this.cornerMask;
	}
}
