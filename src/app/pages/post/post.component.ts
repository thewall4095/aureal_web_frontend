import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RssFeedDetailsService } from 'src/app/services/rss-feed-details.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as moment_ from 'moment';
const moment = moment_;
import { ActivatedRoute, Router } from "@angular/router";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from 'src/app/services/common.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  linkForm: FormGroup;
  otpForm: FormGroup;

  isbuttonLoaderOn: Boolean = false;
  isOtpFormShown: Boolean = false;
  searchText = '';
  step: Number = 0;
  rssMailId = '';
  showSubmitForm: Boolean = true;
  displayedColumns = ['name', 'duration', 'status'];
  dataSources = [];
  podcast;
  episodes = [];
  episodesLoading: Boolean = false;
  page = 0;
  pageSize = 10;
  viewMoreDescription:Boolean = false;
  constructor(
    public authService: AuthService,
    public rssFeedDetailsService: RssFeedDetailsService,
    private toastr: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    private commonService: CommonService,
    public metatagsService: MetatagsService,
    ) {
      this.metatagsService.defaultTags();
    }

  ngOnInit(): void {
    this.linkForm = new FormGroup({
      'link': new FormControl('', [Validators.required, this.checkLink]),
    });
    this.otpForm = new FormGroup({
      'otp': new FormControl('', [Validators.required, this.checkOtp]),
    });
  }

  checkLink(control) {
    let enteredPassword = control.value
    // let passwordCheck = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
    let passwordCheck = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkOtp(control) {
    let enteredPassword = control.value
    let passwordCheck = /^[0-9]{1,6}$/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorLink(form) {
    return form.get('link').hasError('required') ? 'Link is required' :
      form.get('link').hasError('requirements') ? 'Link is not valid' : '';
  }

  getErrorOtp(form) {
    return form.get('otp').hasError('required') ? 'OTP is required' :
      form.get('otp').hasError('requirements') ? 'OTP needs to be at least 6 digits and all numeric' : '';
  }

  onSubmitLink() {
    this.rssMailId = '';
    let data = this.linkForm.value;
    let body = new FormData;
    body.append('url', data.link);
    body.append('user_id', localStorage.getItem('userId'));
    this.isbuttonLoaderOn = true;
    this.rssFeedDetailsService.validateRssFeed(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        this.isOtpFormShown = true;
        this.rssMailId = res.email;
        this.toastr.success("Feed validated");
        this.step = 2;
        console.log('here');
      }
    });
  }

  onSubmitOtp() {
    let data = this.otpForm.value;
    let body = new FormData;
    body.append('user_id', localStorage.getItem('userId'));
    body.append('otp', data.otp);
    body.append('url', this.linkForm.value.link);

    this.isbuttonLoaderOn = true;

    this.rssFeedDetailsService.verifyOtpAndCreateRSS(body).subscribe((res: any) => {
      if (res.msg) {
        this.toastr.error(res.msg);
        this.isbuttonLoaderOn = false;
      } else {
        this.rssFeedDetailsService.getSubmittedRssFeeds().subscribe((res:any) => {
          this.isbuttonLoaderOn = false;
          this.podcast = res.podcasts[0];
          this.step = 3;
          this.getPodcastEpisodes(this.podcast.id);
        })
      }
    })
  }

  formatDuration(seconds) {
    // return (Math.floor(moment.duration(seconds, 'seconds').asHours()) > 0 ? Math.floor(moment.duration(seconds, 'seconds').asHours()) + ':' : '') + moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
    if((Math.floor(parseInt(seconds) / 60)) > 0){
      return Math.floor(parseInt(seconds) / 60 ) + ' min';
    }else{
      return Math.floor(parseInt(seconds) / 60 ) + ' sec';
    }
  }

  redirectToProfile() {
    this.router.navigateByUrl('/profile');
  }

  getStarted(){
   if(this.authService.isAuthenticated() && this.authService.isHiveConnected()){
     this.step = 1;
   }else{
    this.openAuth();
   }
  }

  openAuth(): void {
    this.dialog.open(HiveAuthComponent, {
      width: '800px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { autoCheck: false }
    });
  }

  getPodcastEpisodes(podcast_id) { 
    this.episodesLoading = true;
    this.commonService.getPodcastEpisodes(localStorage.getItem('userId'), podcast_id, this.page, this.pageSize).subscribe((res:any)=>{
      this.episodes = res.episodes.map(episode=> Object.assign(episode,{publishing : false}));
      this.episodesLoading = false;
    })
  }

  showMoreEpisodes(){
    this.page += 1;
    this.episodesLoading = true;
    this.commonService.getPodcastEpisodes(localStorage.getItem('userId'), this.podcast.id, this.page, this.pageSize).subscribe((res:any)=>{
      this.episodes = [...this.episodes, ...res.episodes.map(episode=> Object.assign(episode,{publishing : false}))];
      this.episodesLoading = false;
    })
  }

  publishEpisode(episode) {
      episode.publishing = true;
      let body1 = new FormData;
      body1.append('episode_id', episode.id);
      this.commonService.manualHivePublish(body1).subscribe((res: any) => {
        episode.publishing = false;
        if (res.msg) {
          this.toastr.error(res.msg);
        } else {
          episode.hive_status = 'done';
          // this.addToSelectedCommunity(community);
        }
      });
  }
}
