import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StringDate } from '../../types/string-date';
import { NoteModel } from '../../types/note-model';
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'editor-notes',
	imports: [CommonModule, FormsModule],
	templateUrl: './editor-notes.component.html',
	styleUrl: './editor-notes.component.css'
})
export class EditorNotesComponent implements OnInit {
	noteId: number | null = null;
	me! : NoteModel;
	originalNote: NoteModel | null = null;

	constructor(private route: ActivatedRoute, private noteService: NoteService) {}

	ngOnInit() {
		this.noteId = +this.route.snapshot.paramMap.get('id')!;
		if (isNaN(this.noteId)) {
			// Create mode
			this.noteId = null;
			this.me = new NoteModel();
		} else {
			// Edit mode - fetch note by this.noteId
			const note = this.noteService.getNoteById(this.noteId);
			this.me = note ? { ...note } : new NoteModel();
			this.originalNote = { ...this.me }; // shallow copy
		}
	}

	Save() {
		if (!this.me) return;
		console.log("save ", this.me.id);
		this.me.lastModification = StringDate.fromDate(new Date());
		this.noteService.saveNote(this.me);
		this.goBackToSearch();
	}
	goBackToSearch() {
		// optionally redirect after saving
		window.history.back(); // or use router.navigate(['/search']) if set up
	}
	Clear() {
		console.log("clear ", this.me.id);
		this.me.title = "";
		this.me.text = "";
	}
	Reset() {
		console.log("reset ", this.me.id);
		if (this.originalNote) {
			this.me.title = this.originalNote.title;
			this.me.text = this.originalNote.text;
		}
	}
}
