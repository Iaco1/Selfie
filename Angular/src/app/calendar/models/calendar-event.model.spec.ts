import { CalendarEvent } from './calendar-event.model';
import {TimemachineComponent} from '../timemachine/timemachine.component';

describe('CalendarEvent', () => {
  it('should create an instance', () => {
    expect(new CalendarEvent(new Date(Date.now()))).toBeTruthy();
  });
});
