import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteComponent } from '../note/note.component';
import { NoteModel } from '../../types/note-model';
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'search-notes',
	imports: [CommonModule, NoteComponent],
	templateUrl: './search-notes.component.html',
	styleUrl: './search-notes.component.css'
})
export class SearchNotesComponent {
	notes: NoteModel[] = [];

	constructor(private router: Router, private noteService: NoteService) {}
	ngOnInit() {
		this.noteService.notes$.subscribe(notes => {
			this.notes = notes;
		});
	}
	ngDoCheck() {
		this.notes = this.noteService.getNotes();
	}

	createNote() {
		this.router.navigate(['/editor']);
	}
}
