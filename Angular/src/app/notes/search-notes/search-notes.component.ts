import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { NoteService } from '../../services/note.service';

import { NoteComponent } from '../note/note.component';
import { NoteModel } from '../../types/note.model';

@Component({
	selector: 'search-notes',
	imports: [CommonModule, FormsModule, NoteComponent, HttpClientModule],
	providers: [NoteService],
	templateUrl: './search-notes.component.html',
	styleUrl: './search-notes.component.css',
	standalone: true
})
export class SearchNotesComponent {
	notes: NoteModel[] = [];
	sorting: string = 'id';

	constructor(private router: Router, private noteService: NoteService) {}

	ngOnInit() {
		this.fetchNotes();
	}

	fetchNotes() {
		//filter notes by author
		this.noteService.getOnlyMyNotes().subscribe({
			next: (data) => {
				//console.log('Fetched notes:', data);
				this.notes = data;
				this.onSortingChange(); // apply initial sorting
			},
			error: (err) => {
				console.error('Failed to load notes:', err);
			}
		});
	}

	createNote() {
		this.router.navigate(['/editor-note']);
	}
	onNoteDeleted(noteId: string) {
		this.notes = this.notes.filter(note => note._id !== noteId);
	}

	onSortingChange() {
		switch (this.sorting) {
			case 'id':
				this.notes.sort((a, b) => a._id.localeCompare(b._id));
				break;
			case 'title':
				this.notes.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'creation':
				this.notes.sort((a, b) =>
					a.creation.getTime() - b.creation.getTime()
				);
				break;
			case 'lastMod':
				this.notes.sort((a, b) =>
					a.lastModification.getTime() - b.lastModification.getTime()
				);
				break;
			case 'length':
				this.notes.sort((a, b) => a.text.length - b.text.length);
				break;
			default:
				break;
		}
	}

  protected readonly Array = Array;
}
