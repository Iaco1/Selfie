import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ActivityModel } from '../types/activity.model';
import { BaseService } from './base.service';
import { StringDate } from '../types/string-date';

@Injectable({
	providedIn: 'root'
})
export class ActivityService extends BaseService<ActivityModel> {
	constructor(http: HttpClient) {
		super(http, environment.baseURL + '/activity', ActivityService.transform);
	}

	private static transform (json: any): ActivityModel {
		let expirationDay = new StringDate(json.expirationDay.date, json.expirationDay.time);
		let activity = new ActivityModel(expirationDay, json.title, json.description, json.colour, json.user);
		activity.setId(json._id);
		return activity;
	}

	getOnlyMyActivities(): Observable<ActivityModel[]> {
		let user = localStorage.getItem("authToken");
		return this.getAll(`/?user=${user}`);
	}
}
