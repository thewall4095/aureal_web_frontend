import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiveonboardComponent } from './hiveonboard.component';

describe('HiveonboardComponent', () => {
  let component: HiveonboardComponent;
  let fixture: ComponentFixture<HiveonboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiveonboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiveonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
