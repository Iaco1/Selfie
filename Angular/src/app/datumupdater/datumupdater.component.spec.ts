import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatumupdaterComponent } from './datumupdater.component';

describe('DatumupdaterComponent', () => {
  let component: DatumupdaterComponent;
  let fixture: ComponentFixture<DatumupdaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatumupdaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatumupdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
