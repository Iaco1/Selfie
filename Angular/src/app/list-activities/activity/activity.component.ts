import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivityModel } from "../../types/activity.model";


@Component({
	selector: "activity",
	imports: [CommonModule, FormsModule],
	templateUrl: "./activity.component.html",
	styleUrl: "./activity.component.css"
})
export class ActivityComponent {
	@Input() me!: ActivityModel;
	@Input() visualize: string ="list";
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
}
