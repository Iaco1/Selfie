import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateselectComponent } from '../dateselect/dateselect.component';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
	selector: 'timemachine',
	standalone: true,
	imports: [FormsModule, DateselectComponent],
	templateUrl: './timemachine.component.html',
	styleUrls: ['./timemachine.component.css']
})
export class TimemachineComponent {
	day!: Date; // ticking "virtual" time
	time : string = "";
	dwmy = "m";
	offsetMs = 0;
	private timer: any;

	constructor(private timeMachine: TimeMachineService) {}

	private pad(n: number): string {
		return n.toString().padStart(2, '0');
	}
	private formatTime(date: Date): string {
		const h = this.pad(date.getHours());
		const m = this.pad(date.getMinutes());
		const s = this.pad(date.getSeconds());
		return `${h}:${m}:${s}`;
	}

	ngOnInit() {
		// Get reference date from the service
		const referenceDate = this.timeMachine.day;
		this.offsetMs = referenceDate.getTime() - Date.now();
		// Start ticking virtual clock
		this.timer = setInterval(() => {
			this.day = new Date(Date.now() + this.offsetMs);
      this.timeMachine.setDay(this.day);
		}, 1000);
		this.time = this.formatTime(referenceDate); // 👈 init time
	}
	ngOnDestroy() {
		if (this.timer) clearInterval(this.timer);
	}

	changedDay(newDate: Date) {
		if (!newDate) return;

		const updated = new Date(newDate);
		this.time = this.formatTime(updated);

		this.offsetMs = updated.getTime() - Date.now();
		this.timeMachine.setDay(updated);
	}

	changedDwmy(value: string) {
		this.dwmy = value;
	}

	onTimeChange(newTime: string) {
		if (!newTime) return;
		this.time = newTime;

		const [h, m, s] = newTime.split(":").map(Number);
		const updated = new Date(this.timeMachine.day);
		updated.setHours(h, m, s ?? 0, 0);

		this.offsetMs = updated.getTime() - Date.now();
		this.timeMachine.setDay(updated);
	}
	onTimeInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.onTimeChange(input.value);
	}
}
