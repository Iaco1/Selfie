import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { marked } from 'marked';
import {NoteModel} from '../../types/note-model'
import { NoteService } from '../../services/note.service';

@Component({
	selector: 'note',
	imports: [CommonModule],
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnChanges {
	//note part
	@Input() me! : NoteModel;
	convertedMarkdown: string = '';

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
			const previewText = this.me.text.substring(0, 200); // 🟢 limit to 200 chars
			this.convertedMarkdown = await marked(previewText);
		}
	}
	//router part
	constructor(private router: Router, private noteService: NoteService) {}
	EditNote(id: number) {
		this.router.navigate(['/editor', id]);
	}
	Delete() {
		console.log("delete ", this.me.id);
		if (confirm('Are you sure you want to delete this note?')) {
			this.noteService.deleteNote(this.me.id);
		}
	}
}
