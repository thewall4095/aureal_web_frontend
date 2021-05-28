import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import {CommonService} from 'src/app/services/common.service';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { PlayerService } from 'src/app/services/player.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-podcast-card',
  templateUrl: './podcast-card.component.html',
  styleUrls: ['./podcast-card.component.scss']
})
export class PodcastCardComponent implements OnInit {
  @Input() podcastData;
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
    this.router.navigateByUrl('podcast/'+data.id);
  }

  followPodcast() {
    if (this.podcastData.id) {
      let body = new FormData;
      if (this.authService.isAuthenticated()) {
        body.append('user_id', localStorage.getItem('userId'));
        body.append('podcast_id', this.podcastData.id);
        this.commonService.followPodcast(body).subscribe((res: any) => {
          this.podcastData.ifFollows = !this.podcastData.ifFollows;
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
}
