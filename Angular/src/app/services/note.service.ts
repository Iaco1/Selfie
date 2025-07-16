// services/note.service.ts
import { Injectable } from '@angular/core';
import { NoteModel } from '../types/note-model';
import { StringDate } from '../types/string-date';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class NoteService {
	private notes: NoteModel[] = [];
	private nextId = 1;

	private notesSubject = new BehaviorSubject<NoteModel[]>(this.notes);
	notes$ = this.notesSubject.asObservable();

	getNotes(): NoteModel[] {
		return this.notes;
	}

	getNoteById(id: number): NoteModel | undefined {
		return this.notes.find(note => note.id === id);
	}

	saveNote(note: NoteModel, date: Date) {
		if (!note.id) {
			note.id = this.nextId++;
			note.creation = StringDate.fromDate(date);
			note.lastModification = note.creation.clone();
			this.notes.push(note);
		} else {
			const existing = this.notes.find(n => n.id === note.id);
			if (existing) {
				Object.assign(existing, note);
				existing.lastModification = StringDate.fromDate(date);
			}
		}
	}

	deleteNote(id: number) {
		this.notes = this.notes.filter(note => note.id !== id);
		this.notesSubject.next([...this.notes]); // emit updated list
	}
}
