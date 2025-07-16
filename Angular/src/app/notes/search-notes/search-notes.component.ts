import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteComponent } from '../note/note.component';
import { NoteModel } from '../../types/note-model';
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'search-notes',
	imports: [CommonModule, FormsModule, NoteComponent],
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

	//sorting
	sorting: string = "id";
	onSortingChange() {
		switch(this.sorting) {
			case "id":
				this.notes.sort((a, b) => a.id - b.id);
				break;
			case "title":
				this.notes.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "creation":
				this.notes.sort((a, b) => {
					const aDate = a.creation.getDate();
					const bDate = b.creation.getDate();
					return aDate.getTime() - bDate.getTime();
				});
				break;
			case "lastMod":
				this.notes.sort((a, b) => {
					const aDate = a.lastModification.getDate();
					const bDate = b.lastModification.getDate();
					return aDate.getTime() - bDate.getTime();
				});
				break;
			case "length":
				this.notes.sort((a, b) => a.text.length - b.text.length);
				break;
			default:
				break;
		}
	}
}
