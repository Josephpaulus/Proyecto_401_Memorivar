import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsLearningComponent } from './results-learning.component';

describe('ResultsLearningComponent', () => {
  let component: ResultsLearningComponent;
  let fixture: ComponentFixture<ResultsLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsLearningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
