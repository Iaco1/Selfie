// note.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { NoteModel } from '../../types/note.model';
import { NoteService } from '../../services/note.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { StringDate } from '../../types/string-date';

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
	currentDate!: Date;

	constructor(
		private router: Router,
		private noteService: NoteService,
		private timeMachine: TimeMachineService
	) {}

	ngOnInit() {
		this.timeMachine.day$.subscribe(date => {
			this.currentDate = date;
		});
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
		this.router.navigate(['/editor-note', id]);
	}

	DupeNote(id: string) {
		if (!this.me) return;

		const createdAt = this.me.creation.getDate();
		const modifiedAt = this.me.lastModification?.getDate?.() ?? createdAt;
		const current = this.currentDate;

		const latest = StringDate.fromDate(
			new Date(Math.max(
				createdAt.getTime(),
				modifiedAt.getTime(),
				current.getTime()
			))
		);

		const dupe: NoteModel = {
			...structuredClone(this.me), // deep copy
			_id: '', // let backend assign a new ID
			title: this.me.title + ' (Copy)',
			creation: latest,
			lastModification: latest
		};

		this.noteService.create(dupe).subscribe({
			next: (newNote) => {
				// maybe navigate to the new note
				this.router.navigate(['/editor-note', newNote._id]);
			},
			error: (err) => console.error('Duplication failed:', err)
		});
	}

	Delete() {
		if (!this.me._id) return;
		if (confirm('Are you sure you want to delete this note?')) {
			this.noteService.delete(this.me._id).subscribe({
				next: () => {
					//console.log('Note deleted successfully.');
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
