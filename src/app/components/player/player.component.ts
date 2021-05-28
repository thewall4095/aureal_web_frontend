import { Component, OnInit, Input, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { StreamState } from 'src/app/interfaces/stream-state';
import { PlayerService } from 'src/app/services/player.service';

import { Track } from 'ngx-audio-player';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  // @HostListener('document:keyup', ['$event']);
  @Input() toPlayData;
  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};
  prevToPlayData;
  globalListenFunc: Function;

  constructor(
    private audioService: AudioService,
    private renderer: Renderer2,
    public playerService: PlayerService,
    ) {
    // get media files
    this.files = [
      // tslint:disable-next-line: max-line-length
      {
        url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3',
        name: 'Perfect',
        artist: ' Ed Sheeran'
      },
      {
        // tslint:disable-next-line: max-line-length
        url: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
        name: 'Man Atkeya Beparwah',
        artist: 'Nusrat Fateh Ali Khan'
      },
      {
        url: 'https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3',
        name: 'Penny Lane',
        artist: 'The Beatles'
      }
    ];
    // this.openFile(this.files[0], 0);
    // listen to stream state
    this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });
  }


  ngOnChanges() {
    console.log('test this', this.prevToPlayData);

    if (this.prevToPlayData && this.prevToPlayData.url != this.toPlayData.url) {
      this.prevToPlayData = this.toPlayData;
      this.playStream(this.toPlayData.url);
    }
  }

  ngOnInit(): void {
    // this.globalListenFunc = this.renderer.listen('document', 'keypress', e => {
    //   console.log(e.code);
    //   if (e.code == 'Space' && this.state.canplay) {
    //     if (this.state.playing) {
    //       this.pause();
    //     } else {
    //       this.play();
    //     }
    //   }
    // });
    console.log('chalja', this.toPlayData);
    if (this.toPlayData) {
      this.prevToPlayData = this.toPlayData;
      this.playStream(this.toPlayData.url);
    }
  }


  // handleKeyboardEvent(event: KeyboardEvent) {
  //   console.log(event);
  //   switch (event.key) {
  //     case 'ArrowLeft':
  //       // trigger something from the left arrow
  //       ;
  //       break;
  //     case 'ArrowRight':
  //       ;
  //       // trigger something from the right arrow
  //   }
  // }

  playStream(url) {
    this.audioService.playStream(url)
      .subscribe(events => {
        // listening for fun here
      });
  }

  stopPlaying(){
    this.playerService.setCurrentModule(null);
    this.playStream(null);
    this.stop();
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    // this.audioService.seekTo(this.state?.currentTime+10);
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isReplayDisabled() {
    return this.state?.currentTime < 10;
  }

  isForwardDisabled() {
    return this.state?.duration - this.state?.currentTime < 10;
  }

  forward() {
    this.audioService.seekTo(this.state?.currentTime + 10);
  }

  replay() {
    this.audioService.seekTo(this.state?.currentTime - 10);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  ngOnDestroy() {
    // remove listener
    // this.globalListenFunc();
  }

}
