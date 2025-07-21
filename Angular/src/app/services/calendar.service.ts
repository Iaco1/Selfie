import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CalendarEvent } from '../types/calendar-event.model';
import { BaseService } from './base.service';
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
		let evento = new CalendarEvent(start, end, json.duration, json.colour, json.title, json.description);
		evento.setId(json._id);
		return evento;
	}
}
