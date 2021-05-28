import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RssFeedDetailsService } from 'src/app/services/rss-feed-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';
import * as moment_ from 'moment';
const moment = moment_;
import {CommonService} from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-episode-list-card-profile',
  templateUrl: './podcast-profile.component.html',
  styleUrls: ['./podcast-profile.component.scss']
})
export class PodcastProfileComponent implements OnInit {
  podcastData;
  playingId = 0;
  podcastId;
  showPlayer: boolean = true;
  progress: boolean = true;
  categoryBasedPodcastsLoading = false;
  viewMoreDescription: boolean = false;
  //scroll
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  //paginate
  page = -1;
  pageSize = 10;
  sharedEpisode;
  sharedEpisodeLoading: Boolean = false;
  userId = localStorage.getItem('userId');

  similarPodcastsLoading:Boolean = false;
  similarPodcasts = [];
  constructor(public rssFeedDetailsService: RssFeedDetailsService,
    public activatedRoute: ActivatedRoute, public playerService: PlayerService,
    private commonService : CommonService,
    private toastr: ToastrService,
    public authService: AuthService,
    public dialog: MatDialog,
    public router: Router,
    public metatagsService: MetatagsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(()=>{
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      },100)
    }
    this.progress = true;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.podcastId = paramMap.get('podcast_id');
      this.rssFeedDetailsService.getRssFeedDetails(paramMap.get('podcast_id'), this.page, this.pageSize).then(res => {
        this.podcastData = res['podcast']; //.find( podcast => podcast.id===parseInt(window.location.pathname.split('/')[2]));
        // document.title = this.podcastData.name;
        this.metatagsService.assignTags(
          this.podcastData.name,
          this.podcastData.description,
          'https://aureal.one/podcast/'+this.podcastData.id,
          this.podcastData.image,
        );
        this.progress = false;
        this.podcastData['Episodes'] = [];
        this.onScrollDown();
      });
      this.getSimilarPodcasts();
      // this.commonService.getPodcastEpisodes(localStorage.getItem('userId'),this.podcastId, 0,10).subscribe((res:any) => {
      //   this.podcastData['Episodes'] = res.episodes;
      // })
    });
  }

  getSimilarPodcasts(){
    this.similarPodcastsLoading = true;
    this.commonService.getSimilarPodcasts(this.podcastId).subscribe((res:any) => {
      this.similarPodcasts = res.podcasts;
      this.similarPodcastsLoading = false;
    })
  }

  followPodcast() {
    if (this.podcastData.id) {
      let body = new FormData;
      if (this.authService.isAuthenticated()) {
        body.append('user_id', localStorage.getItem('userId'));
        body.append('podcast_id', this.podcastData.id);
        this.commonService.followPodcast(body).subscribe((res: any) => {
          this.podcastData.ifFollows = true;
        })
      } else {
        this.openHiveAuthDialog(false);
      }
    }
  }

  onScrollDown() {
    this.page += 1;
    this.categoryBasedPodcastsLoading = true;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.podcastId = paramMap.get('podcast_id');
      this.commonService.getPodcastEpisodes(localStorage.getItem('userId'), paramMap.get('podcast_id'), this.page, this.pageSize).subscribe((res:any) => {
        this.podcastData['Episodes'] = [...this.podcastData['Episodes'], ...res.episodes];
        // this.podcastData.Episodes = this.podcastData.Episodes.concat(res['podcasts'][0].Episodes); //.find( podcast => podcast.id===parseInt(window.location.pathname.split('/')[2]));
        this.categoryBasedPodcastsLoading = false;
      })
    });
  }

  openHiveAuthDialog(autoCheck: Boolean): void {
    this.dialog.open(HiveAuthComponent, {
      width: '800px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { autoCheck: autoCheck }
    });
  }

  changePlaying(index) {
    this.showPlayer = false;
    this.playingId = index;
    console.log(this.playingId)
    setTimeout(() => {
      this.showPlayer = true;
    }, 50);
  }

  playEpisode(episodeData) {
    this.playerService.setCurrentModule(episodeData);
  }
  redirectToPodcast(podcast) {
    this.router.navigateByUrl('podcast/' + podcast.id);
  }

  formatDuration(seconds) {
    // return (Math.floor(moment.duration(seconds, 'seconds').asHours()) > 0 ? Math.floor(moment.duration(seconds, 'seconds').asHours()) + ':' : '') + moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
    if((Math.floor(parseInt(seconds) / 60)) > 0){
      return Math.floor(parseInt(seconds) / 60 ) + ' min';
    }else{
      return Math.floor(parseInt(seconds) / 60 ) + ' sec';
    }
  }

  tempdurationupvotes(sec) {
    return Math.floor(sec / 150);
  }


  socialShare(type, episodeData) {
    this.dialog.open(SocialShareComponent, {
      width: '400px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { type: type, attributes: episodeData }
    });
  }
}
