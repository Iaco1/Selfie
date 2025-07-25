import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NoteModel } from '../types/note.model';
import { environment } from '../../environments/environment';
import { StringDate } from '../types/string-date';
import { BaseService } from '../utils/base.service';

@Injectable({ providedIn: 'root' })
export class NoteService extends BaseService<NoteModel> {
	constructor(http: HttpClient) {
		super(http, environment.baseURL + '/note', NoteService.transform);
	}
	private static transform = (note: any): NoteModel => ({
		...note,
		creation: new StringDate(note.creation.date, note.creation.time),
		lastModification: new StringDate(note.lastModification.date, note.lastModification.time)
	});

	getOnlyMyNotes(): Observable<NoteModel[]> {
		let author = localStorage.getItem("authToken");
		return this.getAll(`/?author=${author}`);
	}
}
