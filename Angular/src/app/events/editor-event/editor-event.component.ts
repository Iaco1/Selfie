import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { EventModel } from "../../types/event.model";
import { EventService } from "../../services/event.service";
import { StringDate } from "../../types/string-date";

@Component({
	selector: "editor-event",
	imports: [CommonModule, FormsModule, HttpClientModule],
	providers: [EventService],
	templateUrl: "./editor-event.component.html",
	styleUrl: "./editor-event.component.css"
})
export class EditorEventComponent implements OnInit {
	eventId: string | null = null;
	me!: EventModel;
	viewMode!: string;
	
	constructor(
		private route: ActivatedRoute,
		private eventService: EventService,
		private router: Router
	) {}

	ngOnInit() {
		this.eventId = this.route.snapshot.paramMap.get('id');
		this.viewMode = this.route.snapshot.queryParamMap.get('view') || 'month';

		if (!this.eventId) {
			// Creation mode
			const dateParam = this.route.snapshot.queryParamMap.get('date');
			const startDate = dateParam ? new Date(dateParam) : new Date();

			this.me = new EventModel(StringDate.fromDate(startDate));
			return;
		}
		// Edit mode - fetch note from server
		this.eventService.getById(this.eventId).subscribe({
			next: (date) => {
				//console.log('event id: ', this.eventId , ' event:', date);
				this.me = date;
			},
			error: (err) => {
				console.error('Failed to load event:', err);
			}
		});
	}

	goBackToCalendar() {
		this.router.navigate(['calendar'], {
			queryParams: {
				view: this.viewMode,
				date: this.me.start.date
			}
		});
	}

	//events
	saveEvent() {
		if (!this.me._id) {
			// Create new event
			this.eventService.create(this.me).subscribe({
				next: (createdEvent) => {
					this.me = createdEvent;
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Failed to create event:', err);
				}
			});
		} else {
			// Update existing event
			this.eventService.update(this.me._id, this.me).subscribe({
				next: (updatedEvent) => {
					this.me = updatedEvent;
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Failed to update event:', err);
				}
			});
		}
	}

	deleteEvent() {
		if (!this.me._id) return;
		if (confirm('Are you sure you want to delete this note?')) {
			this.eventService.delete(this.me._id).subscribe({
				next: () => {
					//console.log('Event deleted successfully.');
					this.goBackToCalendar();
				},
				error: (err) => {
					console.error('Delete failed:', err);
				}
			});
		}
	}
}
