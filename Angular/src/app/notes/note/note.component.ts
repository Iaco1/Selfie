// note.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { NoteModel } from '../../types/note.model';
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'note',
	imports: [CommonModule],
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css'],
	standalone: true
})
export class NoteComponent implements OnChanges {
	@Input() me!: NoteModel;
	convertedMarkdown: string = '';
	@Output() deleted = new EventEmitter<string>();

	constructor(
		private router: Router,
		private noteService: NoteService
	) {}

	ngOnInit() {
		this.convertMarkdown();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['me']) {
			this.convertMarkdown();
		}
	}

	async convertMarkdown() {
		if (this.me?.text) {
			const previewText = this.me.text.substring(0, 200);
			this.convertedMarkdown = await marked(previewText);
		}
	}

	EditNote(id: string) {
		this.router.navigate(['/editor', id]);
	}

	Delete() {
		if (!this.me._id) return;
		if (confirm('Are you sure you want to delete this note?')) {
			this.noteService.deleteNote(this.me._id).subscribe({
				next: () => {
					console.log('Note deleted successfully.');
					//emit event to parent to refresh note list
					this.deleted.emit(this.me._id);
				},
				error: (err) => {
					console.error('Delete failed:', err);
				}
			});
		}
	}
}
