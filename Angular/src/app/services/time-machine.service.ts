import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toLocal, fromLocal } from '../utils/date';

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
		localStorage.setItem(this.STORAGE_KEY, toLocal(date));
	}

	loadStoredDate(): Date {
		const saved = localStorage.getItem(this.STORAGE_KEY);
		return saved ? fromLocal(saved) : new Date(); // fallback = now
	}
}
