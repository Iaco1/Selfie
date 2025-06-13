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

	@Output() changedDayEvent = new EventEmitter<Date>();
	
	default_time = new Date();
	today = new Date(this.default_time);

	//time
	offsetMs = 0; //difference between today and default_time
	@Input() liveTime = false;
	time: string | null = null;
	private timer: any;

	@Output() changeDWMY = new EventEmitter<string>();
	dwmy: ' ' | 'd' | 'w' | 'm' | 'y' = "m";

	onDwmyChange(newValue: string) {
		this.changeDWMY.emit(newValue);
	}

	//fai in modo che angular cambi il template...
	private cambiaRiferimento(str : string = "") {
		this.today = new Date(this.today);
		this.changedDayEvent.emit(this.today);
	//  console.log(str, this.today);
	}
	private  syncTimeInput(): void {
		const hours = this.today.getHours().toString().padStart(2, '0');
		const minutes = this.today.getMinutes().toString().padStart(2, '0');
		this.time = `${hours}:${minutes}`;
	}

	//funzioni normali
	default(): void {
		this.today = new Date(this.default_time);
		this.offsetMs = 0;
		this.time = null; // shows --:-- in browser
		this.cambiaRiferimento("default button pressed");
	}

	aggiornaData(
		direz: 'prev' | 'next',
		dwmy: ' ' | 'd' | 'w' | 'm' | 'y',
		today: Date
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
		this.syncTimeInput()
		this.changedDayEvent.emit(this.today);
	}

	//time 00:00
	onTimeChange(newValue: string) {
		// console.log("CHANGE TIME", newValue);
		if (!newValue || !this.today) return;
		this.time = newValue;

		const [hoursStr, minutesStr] = newValue.split(':');
		const hours = parseInt(hoursStr, 10);
		const minutes = parseInt(minutesStr, 10);
	  
		// Update time on this.today
		this.today.setHours(hours, minutes, 0, 0);
		// Now update offsetMs so that periodic timer respects it
		this.offsetMs = this.today.getTime() - this.default_time.getTime()

		this.cambiaRiferimento();
	}
	onTimeInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const value = input.value;
		this.onTimeChange(value);
	}

	//tick
	ngOnInit() {
		if(this.liveTime) {
			this.timer = setInterval(() => {
				let updated = new Date(Date.now() + this.offsetMs);
				//console.log("Tick:", updated);
				this.today = updated;
				this.changedDayEvent.emit(this.today);
			}, 1000);
		}
	}
	ngOnDestroy() {
		if(this.timer) { clearInterval(this.timer); }			
	}
}
