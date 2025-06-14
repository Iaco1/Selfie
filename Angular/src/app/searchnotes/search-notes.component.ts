import { Component } from '@angular/core';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-notes',
  imports: [NoteComponent],
  templateUrl: './search-notes.component.html',
  styleUrl: './search-notes.component.css'
})
export class SearchNotesComponent {

}
