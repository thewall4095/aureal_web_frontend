import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AudioService } from 'src/app/services/audio.service';
import { StreamState } from 'src/app/interfaces/stream-state';

@Component({
  selector: 'app-episodeembed',
  templateUrl: './episodeembed.component.html',
  styleUrls: ['./episodeembed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EpisodeembedComponent implements OnInit {
  progress: boolean = true;
  episodeId;
  episodeData;
  subscription;
  state: StreamState;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService : CommonService,
    private audioService: AudioService,
  ) { }

  ngOnInit(): void {
    this.progress = true;
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.episodeId = paramMap.get("episode_id");
      this.commonService
        .getEpisode(this.episodeId)
        .subscribe((res: any) => {
          console.log(res);
          this.progress = false;
          this.episodeData = res.episode;
        });
    });
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.playStream(this.episodeData.url)
    .subscribe(events => {
      // listening for fun here
    });
    this.subscription = this.audioService.getState()
    .subscribe(state => {
      this.state = state;
    });
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  isReplayDisabled() {
    return this.state?.currentTime < 10;
  }

  isForwardDisabled() {
    return this.state?.duration - this.state?.currentTime < 10;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  forward() {
    this.audioService.seekTo(this.state?.currentTime + 10);
  }

  replay() {
    this.audioService.seekTo(this.state?.currentTime - 10);
  }

 
  ngOnDestroy() {
    // remove listener
    // this.globalListenFunc();
    if(this.subscription)
      this.subscription.unsubscribe();
  }

}
