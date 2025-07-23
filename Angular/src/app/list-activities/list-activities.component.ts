import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
	activities: ActivityModel[] = [];
	sorting: string = 'id';

	constructor(private activityService: ActivityService) {}

	ngOnInit() {
		this.fetchActivities();
	}

	fetchActivities() {
		//filter activities by author
		this.activityService.getOnlyMyActivities().subscribe({
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
		let date = StringDate.fromDate(new Date());
		let newActivity = new ActivityModel(date);
		this.activities.push(newActivity);
	}

	onSaveActivity(updatedEvent: ActivityModel) {
		const index = this.activities.findIndex(activity => activity._id === updatedEvent._id);
		if (index !== -1) {
			this.activities[index] = updatedEvent;
		} else {
			this.activities.push(updatedEvent);
		}
	}
	
	onDeleteActivity(activityToDelete: ActivityModel) {
		if (!activityToDelete._id) return;
	
		this.activityService.delete(activityToDelete._id).subscribe(() => {
			this.activities = this.activities.filter(activity => activity._id !== activityToDelete._id);
		});
	}
}
