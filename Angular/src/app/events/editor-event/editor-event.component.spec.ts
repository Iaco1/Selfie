import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorEventComponent } from './editor-event.component';

describe('EditorEventComponent', () => {
  let component: EditorEventComponent;
  let fixture: ComponentFixture<EditorEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
