import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../services/activity.service';

import { ActivityComponent } from './activity/activity.component';
import { ActivityModel } from '../types/activity.model';
import { StringDate } from '../types/string-date';

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

	activities: ActivityModel[] = [];

	constructor(private actService: ActivityService) {}

	ngOnInit() {
		this.fetchActivities();
	}

	fetchActivities() {
		//filter activities by author
		this.actService.getOnlyMyActivities().subscribe({
			next: (data) => {
				//console.log('Fetched activities:', data);
				this.activities = data;
			},
			error: (err) => {
				console.error('Failed to load activities:', err);
			}
		});
	}

	createActivity() {
		let expiration = StringDate.fromDate(new Date());
		let newActivity = new ActivityModel(expiration, this.title, this.description, this.color);
		newActivity._tempID = crypto.randomUUID();
		this.activities.push(newActivity);
	}

	private notice(activity: ActivityModel) {
		const i = this.activities.findIndex(e =>
			(activity._tempID && e._tempID === activity._tempID) ||
			(activity._id && e._id === activity._id)
		);
	
		if (i !== -1) {
			this.activities[i] = activity;
		} else {
			this.activities = [...this.activities, activity];
		}
	}
	onSaveActivity(activity: ActivityModel) {
		const { _tempID, ...copy } = activity;
	
		const op$ = activity._id
			? this.actService.update(activity._id, copy)
			: this.actService.create(copy);
	
		op$.subscribe(savedActivity => {
			// Reattach _tempID so we can match it in notice()
			savedActivity._tempID = _tempID;
			this.notice(savedActivity);
		});
	}
	
	onDeleteActivity(toDelete: ActivityModel) {
		if (toDelete._id) {
			// Saved on backend, perform API delete
			this.actService.delete(toDelete._id).subscribe(() => {
				this.activities = this.activities.filter(
					activity =>	activity._id !== toDelete._id
				);
			});
		} else {
			// Only exists locally, just remove it
			this.activities = this.activities.filter(
				activity => activity._tempID !== toDelete._tempID
			);
		}
	}
}
