import { Component } from '@angular/core';
import { DateselectComponent } from '../dateselect/dateselect.component';

@Component({
  selector: 'timemachine',
  imports: [DateselectComponent],
  templateUrl: './timemachine.component.html',
  styleUrl: './timemachine.component.css'
})
export class TimemachineComponent {
  day : Date = new Date();
	changedDay(item: Date) {
		this.day = item;
	}
  dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
	}
}
