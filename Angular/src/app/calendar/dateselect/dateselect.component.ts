import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { toLocalDateString } from '../../utils/date';

@Component({
	selector: 'dateselect',standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './dateselect.component.html',
	styleUrl: './dateselect.component.css'
})
export class DateselectComponent implements OnInit {
	//time
	@Input() today!: Date;
	@Input() updateRouteOnChange: boolean = true;
	default_time = new Date();
	@Input() defaultDwmy: 'd' | 'w' | 'm' | 'y' = 'm';
	dwmy: 'd' | 'w' | 'm' | 'y' = this.defaultDwmy;
	@Output() changedDayEvent = new EventEmitter<Date>();
	@Output() changeDWMY = new EventEmitter<string>();

	//route gestion
	constructor( private router: Router, private route: ActivatedRoute) {}
	updateRoute() {
		if (!this.updateRouteOnChange) return;
		this.router.navigate([], {
			queryParams: {
				view: this.dwmyToString(this.dwmy),
				date: toLocalDateString(this.today)
			},
			queryParamsHandling: 'merge'
		});
	}
	
	dwmyToString(d: 'd' | 'w' | 'm' | 'y'): string {
		return {
			d: 'day',
			w: 'week',
			m: 'month',
			y: 'year'
		}[d] || 'month';
	}
	
	ngOnInit() {
		if (this.updateRouteOnChange) {
			const viewParam = this.route.snapshot.queryParamMap.get('view');
			if (viewParam) {
				this.dwmy = viewParam.charAt(0) as 'd' | 'w' | 'm' | 'y';
				this.changeDWMY.emit(this.dwmy);
			} else {
				this.dwmy = this.defaultDwmy;
				this.changeDWMY.emit(this.dwmy);
				this.updateRoute();
			}
		} else {
			// Route updates are disabled — trust input
			this.dwmy = this.defaultDwmy;
			this.changeDWMY.emit(this.dwmy);
		}
	}

	onDwmyChange(newValue: string) {
		this.changeDWMY.emit(newValue);
		this.dwmy = newValue as any;
		this.updateRoute();
	}

	//fai in modo che angular cambi il template...
	private cambiaRiferimento(str : string = "") {
		this.today = new Date(this.today);
		this.changedDayEvent.emit(this.today);
	//  console.log(str, this.today);
	}

	//funzioni normali
	default(): void {
		this.default_time = new Date();
		this.today = new Date(this.default_time);
		this.cambiaRiferimento("default button pressed");
		this.updateRoute();
	}

	aggiornaData(
		direz: 'prev' | 'next',
		dwmy: 'd' | 'w' | 'm' | 'y'
	): void {
		const newDate = new Date(this.today);

		const operations = {
			d: () => newDate.setDate(newDate.getDate() + (direz === 'next' ? 1 : -1)),
			w: () => newDate.setDate(newDate.getDate() + (direz === 'next' ? 7 : -7)),
			m: () => newDate.setMonth(newDate.getMonth() + (direz === 'next' ? 1 : -1)),
			y: () => newDate.setFullYear(newDate.getFullYear() + (direz === 'next' ? 1 : -1))
		};
		operations[dwmy]();

		this.today = new Date(newDate); // update display
		this.changedDayEvent.emit(this.today);
	}
}
