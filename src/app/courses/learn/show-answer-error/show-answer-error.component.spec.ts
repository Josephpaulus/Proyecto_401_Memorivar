import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnswerErrorComponent } from './show-answer-error.component';

describe('ShowAnswerErrorComponent', () => {
  let component: ShowAnswerErrorComponent;
  let fixture: ComponentFixture<ShowAnswerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAnswerErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAnswerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
