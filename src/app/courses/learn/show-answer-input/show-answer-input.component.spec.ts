import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnswerInputComponent } from './show-answer-input.component';

describe('ShowAnswerInputComponent', () => {
  let component: ShowAnswerInputComponent;
  let fixture: ComponentFixture<ShowAnswerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAnswerInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAnswerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
