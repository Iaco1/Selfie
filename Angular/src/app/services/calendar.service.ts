import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent } from '../types/calendar-event.model';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class CalendarService {
	myURL = environment.baseURL + "/event";
	constructor(private http: HttpClient) {}
	//create
	saveEvent(event: CalendarEvent): Observable<CalendarEvent> {
		return this.http.post<CalendarEvent>(this.myURL, event);
	}
	//read
	getAllEvents(): Observable<CalendarEvent[]> {
		return this.http.get<CalendarEvent[]>(this.myURL);
	}
	//read by id
	getEvent(eventId: string): Observable<CalendarEvent> {
		return this.http.get<CalendarEvent>(`${this.myURL}/${eventId}`);
	}
	//update
	updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
		return this.http.put<CalendarEvent>(`${this.myURL}/${event.id}`, event);
	}
	//delete
	deleteEvent(eventId: string): Observable<any> {
		return this.http.delete(`${this.myURL}/${eventId}`);
	}
}
