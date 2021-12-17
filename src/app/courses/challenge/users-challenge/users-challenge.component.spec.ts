import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChallengeComponent } from './users-challenge.component';

describe('UsersChallengeComponent', () => {
  let component: UsersChallengeComponent;
  let fixture: ComponentFixture<UsersChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
