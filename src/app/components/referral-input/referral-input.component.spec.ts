import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralInputComponent } from './referral-input.component';

describe('ReferralInputComponent', () => {
  let component: ReferralInputComponent;
  let fixture: ComponentFixture<ReferralInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
