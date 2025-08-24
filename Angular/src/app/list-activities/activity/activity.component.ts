import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivityModel } from "../../types/activity.model";
import { TimeMachineService } from "../../services/time-machine.service";


@Component({
	selector: "activity",
	imports: [CommonModule, FormsModule],
	templateUrl: "./activity.component.html",
	styleUrl: "./activity.component.css"
})
export class ActivityComponent implements OnInit {
	@Input() me!: ActivityModel;
	@Input() visualize: string ="calendar";
	@Output() save = new EventEmitter<ActivityModel>();
	@Output() delete = new EventEmitter<ActivityModel>();

	showModal = false;
	openModal() {
		this.showModal = true;
	}
	closeModal() {
		this.showModal = false;
	}

	saveActivity() {
		this.save.emit(this.me);
		this.closeModal();
	}
	deleteActivity() {
		this.delete.emit(this.me);
		this.closeModal();
	}

	//Overdue output
	currentDate!: Date;
	constructor (private timeMachine: TimeMachineService) {}
	ngOnInit(): void {
		this.timeMachine.day$.subscribe(date => {
			this.currentDate = date;
		});
	}
	getOverdueMessage(activity: ActivityModel): string {
		const seconds = activity.secondsOverdue(this.currentDate);
		if (seconds === 0) return ""; // not overdue
	
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
	
		let parts = [];
		if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
		if (hours > 0) parts.push(`${hours}h`);
		if (minutes > 0) parts.push(`${minutes}m`);
	
		const overdueStr = parts.join(' ');
	
		return `🔴 Overdue by ${overdueStr}`;
	}
}
