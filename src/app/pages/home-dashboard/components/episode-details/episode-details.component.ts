import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment_ from 'moment';
const moment = moment_;
import { HomeDashboardService } from 'src/app/pages/home-dashboard/home-dashboard.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { PlayerService } from 'src/app/services/player.service';
import * as FormData from 'form-data';
@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episodeData;
  categoryBasedPodcastsLoading = false;
  categoryBasedPodcasts = [];
  comments;
  commentText = '';
  episodeId;
  isAddingComment = false;
  upvoteOngoing: Boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private homeDashboardService: HomeDashboardService, public authService: AuthService,
    private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, public playerService: PlayerService) {
    console.log(data);
    if (data && data.id) {
      this.episodeData = data;
      let categoryIds = '';
      this.episodeData['Categories'].forEach(element => {
        categoryIds += (element.id + '_');
      });
      if (categoryIds) {
        this.categoryBasedPodcastsLoading = true;
        this.homeDashboardService.categoryBasedPodcasts(0, 10, categoryIds).subscribe((res: any) => {
          this.categoryBasedPodcastsLoading = false;
          this.categoryBasedPodcasts = res.PodcastList;
          console.log(res);
        });
      }
      this.getComments();
    } else {
      this.activatedRoute.paramMap.subscribe(paramMap => {
        this.episodeId = paramMap.get('episode_id');
        this.homeDashboardService.getEpisode(this.episodeId).subscribe((res: any) => {
          console.log(res);
          this.episodeData = res.episode;
          let categoryIds = '';
          this.episodeData['Categories'].forEach(element => {
            categoryIds += (element.id + '_');
          });
          if (categoryIds) {
            this.categoryBasedPodcastsLoading = true;
            this.homeDashboardService.categoryBasedPodcasts(0, 10, categoryIds).subscribe((res: any) => {
              this.categoryBasedPodcastsLoading = false;
              this.categoryBasedPodcasts = res.PodcastList;
              console.log(res);
            });
          }
          this.getComments();
        });
      })
    }


  }

  ngOnInit(): void {
  }

  getComments() {
    this.homeDashboardService.getComments(this.episodeData.id).subscribe((res: any) => {
      console.log(res);
      this.comments = res.comments;
    })
  }

  formatDuration(seconds) {
    return (Math.floor(moment.duration(seconds, 'seconds').asHours()) > 0 ? Math.floor(moment.duration(seconds, 'seconds').asHours()) + ':' : '') + moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
  }

  redirectToPodcast(podcast) {
    this.router.navigateByUrl('podcast/' + podcast.id);
  }

  addComment($event) {
    this.isAddingComment = true;
    let body = new FormData;
    body.append('user_id', localStorage.getItem('userId'));
    body.append('episode_id', this.episodeData.id);
    body.append('text', $event);
    body.append('hive_username', localStorage.getItem('hive_username'));
    this.homeDashboardService.addComment(body).subscribe((res: any) => {
      this.isAddingComment = false;
      if (res) {
        this.getComments();
      } else {
        this.toastr.error("Couldn't add comment");
      }
      console.log(res);
    });
  }

  closeComment() {

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
        this.homeDashboardService.upvoteEpisode(body).subscribe((res: any) => {
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

  openHiveAuthDialog(autoCheck: Boolean): void {
    this.dialog.open(HiveAuthComponent, {
      width: '400px',
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
    this.homeDashboardService.addListen(body).subscribe(res => {
      ;
    })
  }
}
