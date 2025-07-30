import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { EventModel } from '../types/event.model';
import { BaseService } from '../utils/base.service';
import { StringDate } from '../types/string-date';

@Injectable({
	providedIn: 'root'
})
export class EventService extends BaseService<EventModel> {
	constructor(http: HttpClient) {
		super(http, environment.baseURL + '/event', EventService.transform);
	}

	private static transform (json: any): EventModel {
		let start = new StringDate(json.start.date, json.start.time);
		let end   = new StringDate(json.end.date,   json.end.time);
		let evento = new EventModel(start, end, json.duration,
			json.title, json.description, json.colour, json.user, json.repeat);
		evento.setId(json._id);
		return evento;
	}

	getOnlyMyEvents(): Observable<EventModel[]> {
		let user = localStorage.getItem("authToken");
		return this.getAll(`/?user=${user}`);
	}
}
