import { TestBed } from '@angular/core/testing';

import { TimeMachineService } from './time-machine.service';

describe('TimeMachineService', () => {
  let service: TimeMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
