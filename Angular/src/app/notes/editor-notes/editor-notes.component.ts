import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'editor-notes',
	imports: [],
	templateUrl: './editor-notes.component.html',
	styleUrl: './editor-notes.component.css'
})
export class EditorNotesComponent implements OnInit {
	noteId: number | null = null;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.noteId = +this.route.snapshot.paramMap.get('id')!;
		if (isNaN(this.noteId)) {
			this.noteId = null;
			// Create mode
		} else {
			// Edit mode - fetch note by this.noteId
		}
	}
}
