import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgLearnComponent } from './msg-learn.component';

describe('MsgLearnComponent', () => {
  let component: MsgLearnComponent;
  let fixture: ComponentFixture<MsgLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
