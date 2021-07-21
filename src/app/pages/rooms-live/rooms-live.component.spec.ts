import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsLiveComponent } from './rooms-live.component';

describe('RoomsLiveComponent', () => {
  let component: RoomsLiveComponent;
  let fixture: ComponentFixture<RoomsLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
