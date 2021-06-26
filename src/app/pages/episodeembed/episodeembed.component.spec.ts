import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeembedComponent } from './episodeembed.component';

describe('EpisodeembedComponent', () => {
  let component: EpisodeembedComponent;
  let fixture: ComponentFixture<EpisodeembedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeembedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeembedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
