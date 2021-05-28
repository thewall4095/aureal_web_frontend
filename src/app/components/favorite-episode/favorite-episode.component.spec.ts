import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteEpisodeComponent } from './favorite-episode.component';

describe('FavoriteEpisodeComponent', () => {
  let component: FavoriteEpisodeComponent;
  let fixture: ComponentFixture<FavoriteEpisodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteEpisodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
