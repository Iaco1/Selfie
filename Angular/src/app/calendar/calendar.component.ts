import { Component } from '@angular/core';
import { DateselectComponent } from './dateselect/dateselect.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { WeekComponent } from './week/week.component';

@Component({
	selector: 'calendar',
	imports: [
		DateselectComponent, MonthComponent, DayComponent, WeekComponent

	],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.css'
})
export class CalendarComponent {
	day : Date = new Date();
	changedDay(item: Date) {
		this.day = item;
	}
	dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
	}
	createRange(n: number): number[] {
		return Array.from({ length: n }, (_, i) => i + 1);
	}

	events = [
		{ id: 1, title: 'Compleanno Mario', description: 'Festa a casa di Mario' },
    { id: 2, title: 'Meeting lavoro', description: 'Riunione su Zoom' },
    { id: 3, title: 'Dentista', description: 'Controllo annuale' },
	];
}
