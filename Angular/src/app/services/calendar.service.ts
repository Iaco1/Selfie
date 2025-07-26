import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CalendarEvent } from '../types/calendar-event.model';
import { BaseService } from '../utils/base.service';
import { StringDate } from '../types/string-date';

@Injectable({
	providedIn: 'root'
})
export class CalendarService extends BaseService<CalendarEvent> {
	constructor(http: HttpClient) {
		super(http, environment.baseURL + '/event', CalendarService.transform);
	}

	private static transform (json: any): CalendarEvent {
		let start = new StringDate(json.start.date, json.start.time);
		let end   = new StringDate(json.end.date,   json.end.time);
		let evento = new CalendarEvent(start, end, json.duration,
			json.title, json.description, json.colour, json.user);
		evento.setId(json._id);
		return evento;
	}

	getOnlyMyEvents(): Observable<CalendarEvent[]> {
		let user = localStorage.getItem("authToken");
		return this.getAll(`/?user=${user}`);
	}
}
