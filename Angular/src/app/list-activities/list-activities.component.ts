import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../services/activity.service';

import { ActivityComponent } from './activity/activity.component';
import { ActivityModel } from '../types/activity.model';
import { StringDate } from '../types/string-date';
import { CrudHelper } from '../utils/crud-helper';
import { TimeMachineService } from '../services/time-machine.service';

@Component({
	selector: 'list-activities',
	imports: [CommonModule, FormsModule, ActivityComponent, HttpClientModule], 
	providers: [ActivityService],
	templateUrl: './list-activities.component.html',
	styleUrl: './list-activities.component.css',
	standalone: true
})
export class ListActivitiesComponent {
	//new activity fields
	title = "New Activity";
	color = "green";
	description = "";
	currentDate! : Date;

	constructor(private actService: ActivityService, private timeMachine: TimeMachineService) {}

	activities: ActivityModel[] = [];

	private activityCrud!: CrudHelper<ActivityModel>;

	ngOnInit() {
		this.timeMachine.day$.subscribe(date => {
			this.currentDate = date;
		});
		this.fetchActivities();
		this.activityCrud = new CrudHelper(() => this.activities, (l) => this.activities = l);
	}

	fetchActivities() {
		//filter activities by author
		this.actService.getOnlyMyActivities().subscribe({
			next: (data) => this.activities = data,
			error: (err) =>	console.error('Failed to load activities:', err)
		});
	}

	createActivity() {
		let expiration = StringDate.fromDate(this.currentDate);
		let newActivity = new ActivityModel(expiration, this.title, this.description, this.color);
		newActivity._tempID = crypto.randomUUID();
		this.activities.push(newActivity);
	}

	onSaveActivity(activity: ActivityModel) {
		this.activityCrud.save(activity, this.actService);
	}
	
	onDeleteActivity(activity: ActivityModel) {
		this.activityCrud.delete(activity, this.actService);
	}
}
