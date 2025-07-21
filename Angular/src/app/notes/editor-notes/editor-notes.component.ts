// editor-notes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { marked } from 'marked';
import { NoteModel } from '../../types/note.model';
import { StringDate } from '../../types/string-date';

import { TimeMachineService } from '../../services/time-machine.service';

import { HttpClientModule } from '@angular/common/http';
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'editor-notes',
	standalone: true,
	imports: [CommonModule, FormsModule, HttpClientModule],
	providers: [NoteService],
	templateUrl: './editor-notes.component.html',
	styleUrl: './editor-notes.component.css'
})
export class EditorNotesComponent implements OnInit {
	currentDate!: Date;
	noteId: string | null = null;
	me: NoteModel = new NoteModel();
	originalNote: NoteModel | null = null;
	tagsInput: string = '';
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

		this.noteId = this.route.snapshot.paramMap.get('id');
		if (!this.noteId) {
			// Create mode
			this.me = new NoteModel();
		} else {
			// Edit mode - fetch note from server
			this.noteService.getById(this.noteId).subscribe({
				next: (date) => {
					//console.log('note id: ', this.noteId , ' note:', date);
					this.me = date;
					this.originalNote = { ...this.me };
					this.tagsInput = this.me.tags.join(', ');
					this.convertMarkdown();
				},
				error: (err) => {
					console.error('Failed to load note:', err);
					this.me = new NoteModel();
				}
			});			
		}
	}
	ngOnDestroy() {
		this.me = new NoteModel(); // Clean up
	}

	async convertMarkdown() {
		if (!this.me) return;
		this.convertedMarkdown = await marked(this.me.text);
	}

	goBackToSearch() {
		window.history.back();
	}

	updateTagsFromInput() {
		this.me.tags = this.tagsInput
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0);
	}

	Preview() {
		this.convertMarkdown();
	}

	Save() {
		this.updateTagsFromInput();
		this.me.lastModification = StringDate.fromDate(new Date());
		if (this.me._id) {
			// Update existing note
			this.noteService.update(this.me._id, this.me).subscribe({
				next: (updatedNote) => {
					this.me = updatedNote;
					this.goBackToSearch();
				},
				error: (err) => {
					console.error('Failed to update note:', err);
				}
			});
		} else {
			// Create new note
			this.noteService.create(this.me).subscribe({
				next: (newNote) => {
					this.me = newNote;
					this.goBackToSearch();
				},
				error: (err) => {
					console.error('Failed to save note:', err);
				}
			});
		}
	}

	Clear() {
		this.me.title = '';
		this.me.text = '';
		this.me.tags = [];
		this.tagsInput = '';
		this.convertMarkdown();
	}

	Reset() {
		if (this.originalNote) {
			this.me.title = this.originalNote.title;
			this.me.text = this.originalNote.text;
			this.me.tags = [...this.originalNote.tags];
			this.tagsInput = this.me.tags.join(', ');
			this.convertMarkdown();
		}
	}

	Close() {
		this.goBackToSearch();
	}
}
