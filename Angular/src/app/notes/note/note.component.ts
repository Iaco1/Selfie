import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { marked } from 'marked';

@Component({
	selector: 'note',
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnChanges {
	@Input() markdown: string = '';
	convertedMarkdown: string = '';

	async ngOnChanges(changes: SimpleChanges) {
		if ('markdown' in changes) {
			this.convertedMarkdown = await marked(this.markdown || '');
		}
	}
}
