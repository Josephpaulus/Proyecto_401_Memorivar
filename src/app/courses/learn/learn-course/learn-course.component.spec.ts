import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnCourseComponent } from './learn-course.component';

describe('LearnCourseComponent', () => {
  let component: LearnCourseComponent;
  let fixture: ComponentFixture<LearnCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
