import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'dateselect',standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './dateselect.component.html',
	styleUrl: './dateselect.component.css'
})
export class DateselectComponent {
	//time
	@Input() today!: Date;
	@Input() offsetMs = 0; //difference between today and default_time
	default_time = new Date();
	dwmy: ' ' | 'd' | 'w' | 'm' | 'y' = "m";
	@Output() changedDayEvent = new EventEmitter<Date>();
	@Output() changeDWMY = new EventEmitter<string>();

	onDwmyChange(newValue: string) {
		this.changeDWMY.emit(newValue);
	}

	//fai in modo che angular cambi il template...
	private cambiaRiferimento(str : string = "") {
		this.today = new Date(this.today);
		this.changedDayEvent.emit(this.today);
	//  console.log(str, this.today);
	}

	//funzioni normali
	default(): void {
		this.today = new Date(this.default_time);
		this.offsetMs = 0;
		this.cambiaRiferimento("default button pressed");
	}

	aggiornaData(
		direz: 'prev' | 'next',
		dwmy: ' ' | 'd' | 'w' | 'm' | 'y'
	): void {
		const newDate = new Date(this.default_time.getTime() + this.offsetMs);

		const operations = {
			d: () => newDate.setDate(newDate.getDate() + (direz === 'next' ? 1 : -1)),
			w: () => newDate.setDate(newDate.getDate() + (direz === 'next' ? 7 : -7)),
			m: () => newDate.setMonth(newDate.getMonth() + (direz === 'next' ? 1 : -1)),
			y: () => newDate.setFullYear(newDate.getFullYear() + (direz === 'next' ? 1 : -1)),
			' ': () => console.log("Invalid dwmy"),
		};
		operations[dwmy]();

		this.offsetMs = newDate.getTime() - this.default_time.getTime();
		this.today = new Date(newDate); // update display
		this.changedDayEvent.emit(this.today);
	}
}
