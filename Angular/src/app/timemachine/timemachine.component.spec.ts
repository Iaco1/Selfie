import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimemachineComponent } from './timemachine.component';

describe('TimemachineComponent', () => {
  let component: TimemachineComponent;
  let fixture: ComponentFixture<TimemachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimemachineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimemachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
