import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { StringDate } from '../../types/string-date';
import { NoteModel } from '../../types/note-model';
import { NoteService } from '../../services/note.service';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
	selector: 'editor-notes',
	imports: [CommonModule, FormsModule],
	templateUrl: './editor-notes.component.html',
	styleUrl: './editor-notes.component.css'
})
export class EditorNotesComponent implements OnInit {
	currentDate! : Date;
	noteId: number | null = null;
	me! : NoteModel;
	originalNote: NoteModel | null = null;
	tagsInput: string = "";
	convertedMarkdown: string = '';

	constructor(
		private route: ActivatedRoute,
		private noteService: NoteService,
		private timeMachine: TimeMachineService
	) {}
	ngOnInit() {
		this.timeMachine.day$.subscribe(date => {
			this.currentDate = date;
		});
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
		this.tagsInput = this.me.tags.join(', ');
		this.convertMarkdown();
	}
	//ausiliar functions
	async convertMarkdown() {
		if (! this.me) return;
		this.convertedMarkdown = await marked(this.me.text);
	}
	goBackToSearch() {
		// optionally redirect after saving
		window.history.back(); // or use router.navigate(['/search']) if set up
	}
	updateTagsFromInput() {
		this.me.tags = this.tagsInput
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0);
	}
	//buttons
	Preview() {
		// console.log("preview", this.me.id);
		this.convertMarkdown()
	}
	Save() {
		if (!this.me) return;
		// console.log("save ", this.me.id);
		this.updateTagsFromInput();  // Ensure tags are synced before saving
		this.noteService.saveNote(this.me, this.currentDate);
		this.goBackToSearch();
	}
	Clear() {
		// console.log("clear ", this.me.id);
		this.me.title = "";
		this.me.text = "";
		this.me.tags = [];
		this.tagsInput = "";
	}
	Reset() {
		// console.log("reset ", this.me.id);
		if (this.originalNote) {
			this.me.title = this.originalNote.title;
			this.me.text = this.originalNote.text;
			this.me.tags = [...this.originalNote.tags];
			this.tagsInput = this.me.tags.join(', ');
		}
	}
	Close() {
		if (!this.me) return;
		// console.log("close", this.me.id);
		this.goBackToSearch();
	}
}
