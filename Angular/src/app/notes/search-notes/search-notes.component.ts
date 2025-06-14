import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteComponent } from '../note/note.component';
import { NoteModel } from '../../types/note-model';

@Component({
	selector: 'search-notes',
	imports: [CommonModule, NoteComponent],
	templateUrl: './search-notes.component.html',
	styleUrl: './search-notes.component.css'
})
export class SearchNotesComponent {
	notes: NoteModel[] = [];
	constructor(private router: Router) {}

	createNote() {
	  this.router.navigate(['/editor']);
	}
  
	editNote(id: number) {
	  this.router.navigate(['/editor', id]);
	}
}
