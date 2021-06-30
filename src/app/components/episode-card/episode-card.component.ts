import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { PlayerService } from 'src/app/services/player.service';
import {CommonService} from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-episode-card',
  templateUrl: './episode-card.component.html',
  styleUrls: ['./episode-card.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class EpisodeCardComponent implements OnInit {
  @Input() episodeData;
  @Input() isLoading = false;

  upvoteOngoing: Boolean = false;

  constructor(
    public router: Router,
    public authService: AuthService,
    private commonService : CommonService,
    public dialog: MatDialog,
    public playerService: PlayerService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
  }

  openPodcast(data): void {
    this.router.navigateByUrl('podcast/'+data.podcast_id);
  }

  followPodcast(ifFollows) {
    if (this.episodeData.id) {
      let body = new FormData;
      if (this.authService.isAuthenticated()) {
        body.append('user_id', localStorage.getItem('userId'));
        body.append('podcast_id', this.episodeData.id);
        this.commonService.followPodcast(body).subscribe((res: any) => {
          this.episodeData.follows = !this.episodeData.follows;
        })
      } else {
        this.openHiveAuthDialog(false);
      }
    }
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

  socialShare(type, episodeData) {
    this.dialog.open(SocialShareComponent, {
      width: '400px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { type: type, attributes: episodeData }
    });
  }

  playEpisode(episodeData) {
    this.playerService.setCurrentModule(episodeData);
  }

  upvote(episodeData) {
    // if(thi)
    this.upvoteOngoing = true;
    if (!this.authService.isAuthenticated()) {
      // this.router.navigateByUrl('/auth');
      this.openHiveAuthDialog(true);
      this.upvoteOngoing = false;
    } else {
      if (!this.authService.isHiveConnected()) {
        this.openHiveAuthDialog(true);
        this.upvoteOngoing = false;
      } else {
        let body = new FormData;
        body.append('permlink', episodeData.permlink);
        body.append('hive_username', localStorage.getItem('hive_username'));
        body.append('episode_id', episodeData.id);
        body.append('user_id', localStorage.getItem('userId'));
        console.log(body);
        this.commonService.upvoteEpisode(body).subscribe((res: any) => {
          this.upvoteOngoing = false;
          console.log(res);
          if (res.msg) {
            this.toastr.error(res.msg);
          } else if (res.err) {
            this.toastr.error('Something went wrong.');
          } else {
            episodeData.ifVoted = true;
            episodeData.votes = episodeData.votes + 1;
          }
        });
      }
    }
  }

  openEpisode(data): void {
    this.router.navigateByUrl('episode/'+data.id);
  }

  isPaidOut(){
    return moment().diff(this.episodeData.published_at, "days") > 7;
  }

  tipAuthor(episodeData){
    if(episodeData.author_hiveusername){
      window.open('https://buymeberri.es/@'+episodeData.author_hiveusername, "_blank")
      // window.location(episodeData.author_hiveusername);
    }
  }

  formatDuration(seconds) {
    // return (Math.floor(moment.duration(seconds, 'seconds').asHours()) > 0 ? Math.floor(moment.duration(seconds, 'seconds').asHours()) + ':' : '') + moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
    if((Math.floor(parseInt(seconds) / 60)) > 0){
      return Math.floor(parseInt(seconds) / 60 ) + ' min';
    }else{
      return Math.floor(parseInt(seconds) / 60 ) + ' sec';
    }
  }
}
