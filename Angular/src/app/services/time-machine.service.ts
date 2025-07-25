import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TimeMachineService {
	private readonly STORAGE_KEY = 'timemachine-date';

	private daySubject = new BehaviorSubject<Date>(this.loadStoredDate());

	day$ = this.daySubject.asObservable();

	get day(): Date {
		return this.daySubject.value;
	}

	setDay(date: Date): void {
		this.daySubject.next(date);
		localStorage.setItem(this.STORAGE_KEY, date.toISOString());
	}

	private loadStoredDate(): Date {
		const raw = localStorage.getItem(this.STORAGE_KEY);
		if (!raw) return new Date();

		const parsed = new Date(raw);
		return isNaN(parsed.getTime()) ? new Date() : parsed;
	}
}
