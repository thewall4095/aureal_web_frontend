import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;
import { PlayerService } from 'src/app/services/player.service';
import { MatDialog } from "@angular/material/dialog";
import {CommonService} from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from "@angular/router";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-episode-list-card',
  templateUrl: './episode-list-card.component.html',
  styleUrls: ['./episode-list-card.component.scss'],
})
export class EpisodeListCardComponent implements OnInit {
  @Input() episodeData;
  @Input() userId = '';
  @Input() showUpvote : Boolean = false;
  @Input() isLoading = false;

  viewMoreDescription: boolean = false;
  publishing: Boolean = false;
  upvoteOngoing: Boolean = false;

  // @Output() openCard = new EventEmitter<any>(true);
  constructor(public router: Router, public authService: AuthService, public playerService: PlayerService, public dialog: MatDialog, public commonService: CommonService, private toastr: ToastrService) {
  }

  ngOnInit(): void {

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

  tempdurationpaisa(sec) {
    return Math.floor(sec / 10);
  }

  playEpisode(episodeData) {
    this.playerService.setCurrentModule(episodeData);
    this.addListen(episodeData);
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
            this.episodeData.ifVoted = true;
            this.episodeData.votes = episodeData.votes + 1;
          }
        });
      }
    }
  }

  openDialog(data): void {
    this.router.navigateByUrl('episode/'+data.id);
    // this.dialog.open(EpisodeDetailsComponent, {
    //   width: '90vw',
    //   height: '90vh',
    //   maxWidth: '90vw',
    //   maxHeight: '90vh',
    //   hasBackdrop: true,
    //   data: data
    // });
  }

  tipAuthor(episodeData){
    if(episodeData.author_hiveusername){
      window.open('https://buymeberri.es/@'+episodeData.author_hiveusername, "_blank")
      // window.location(episodeData.author_hiveusername);
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

  addListen(episodeData) {
    let body = new FormData;
    body.append('episode_id', episodeData.id);
    body.append('user_id', localStorage.getItem('userId'));
    this.commonService.addListen(body).subscribe(res => {
      ;
    })
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

  openEpisode(data): void {
    this.router.navigateByUrl('episode/'+data.id);
  }

  publishEpisode(episode) {
    this.publishing = true;
    let body1 = new FormData;
    body1.append('episode_id', episode.id);
    this.commonService.manualHivePublish(body1).subscribe((res: any) => {
      this.publishing = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        episode.hive_status = 'done';
        // this.addToSelectedCommunity(community);
      }
    });
  }

  isPaidOut(){
    return moment().diff(this.episodeData.published_at, "days") > 7;
  }
}
