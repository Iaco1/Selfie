import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NoteModel } from '../types/note.model';
import { environment } from '../../environments/environment';
import { StringDate } from '../types/string-date';

@Injectable({
	providedIn: 'root'
})
export class NoteService {
	myURL = environment.baseURL + "/note";
	constructor(private http: HttpClient) {}
	//create
	saveNote(note: NoteModel): Observable<NoteModel> {
		return this.http.post<NoteModel>(this.myURL, note);
	}
	//read
	getAllNotes(): Observable<NoteModel[]> {
		return this.http.get<{ message: string; result: any[] }>(this.myURL).pipe(
			map(response =>
				response.result.map(note => ({
					...note,
					creation: new StringDate(note.creation.date, note.creation.time),
					lastModification: new StringDate(note.lastModification.date, note.lastModification.time)
				}))
			)
		);
	}	
	//read by id
	getNote(noteId: string): Observable<NoteModel> {
		return this.http.get<{ message: string; result: any }>(`${this.myURL}/${noteId}`).pipe(
			map(response => ({
				...response.result,
				creation: new StringDate(response.result.creation.date, response.result.creation.time),
				lastModification: new StringDate(response.result.lastModification.date, response.result.lastModification.time)
			}))
		);
	}
	//update
	updateNote(note: NoteModel): Observable<NoteModel> {
		return this.http.put<NoteModel>(`${this.myURL}/${note._id}`, note);
	}
	//delete
	deleteNote(noteId: string): Observable<any> {
		return this.http.delete(`${this.myURL}/${noteId}`);
	}
}
