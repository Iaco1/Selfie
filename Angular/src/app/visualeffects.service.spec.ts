import { TestBed } from '@angular/core/testing';

import { VisualeffectsService } from './visualeffects.service';

describe('VisualeffectsService', () => {
  let service: VisualeffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualeffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
