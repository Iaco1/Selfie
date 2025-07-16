import { Component } from '@angular/core';
import { DateselectComponent } from '../dateselect/dateselect.component';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'timemachine',
  imports: [DateselectComponent],
  templateUrl: './timemachine.component.html',
  styleUrl: './timemachine.component.css'
})
export class TimemachineComponent {
	day : Date = new Date();
	constructor(private timeMachine: TimeMachineService) {}

	changedDay(item: Date) {
		this.day = item;
		this.timeMachine.setDay(this.day); //service
	}
	dwmy : string = "m"
	changedDwmy(item: string) {
		this.dwmy = item;
	}
}
