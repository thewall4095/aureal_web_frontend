import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { RssFeedDetailsService } from 'src/app/services/rss-feed-details.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { SelectCommunityComponent } from 'src/app/components/select-community/select-community.component';// 'src/app/components/select-community/select-community.component';
import { HomeDashboardService } from 'src/app/pages/home-dashboard/home-dashboard.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import * as FormData from 'form-data';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userDetails;
  podcasts = [];
  isImageUploading: Boolean = false;
  currentTab = 'Podcasts';
  communityTab = 'All Communities';
  allCommunity = [];
  allFollowedCommunity = [];
  allCreatedCommunity = [];
  isCommunityLoaded: Boolean = false;
  profileForm: FormGroup;
  isProfileFormOpen: Boolean = false;
  index = 0;
  unclaimedText = '';
  constructor(private userDetailsService: UserDetailsService, public rssFeedDetailsService: RssFeedDetailsService, private toastr: ToastrService, private router: Router, public dialog: MatDialog, private homeDashboardService: HomeDashboardService, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      'fullname': new FormControl('', [Validators.required]),
      'bio': new FormControl('', []), //this.checkPassword]),
    });

    this.getUserDetails();
    this.rssFeedDetailsService.getSubmittedRssFeeds().subscribe((res: any) => {
      if (res.podcasts && res.podcasts.length) {
        this.podcasts = res.podcasts;
        this.podcasts.forEach(podcast => {
          podcast.Episodes.forEach(element => {
            element['Categories'] = podcast['Categories'];
            element['podcast_name'] = podcast['name'];
            element['author'] = podcast['author'];
          });
        })
      }
      // this.dataSource = res.
    });
    this.getCommunityData();
    this.userDetailsService.getUserHiveDetails().then((res: any) => {
      console.log('hererere', res.client.account.reward_vesting_hive.split(' ')[0]);
      if (res.client && res.client.account.reward_hive_balance.split(' ')[0] != '0.000' && res.client.account.reward_hbd_balance.split(' ')[0] != '0.000' && res.client.account.reward_vesting_hive.split(' ')[0] != '0.000') {
        this.unclaimedText = `Unclaimed balance for ${localStorage.getItem('hive_username')}: ${res.client.account.reward_hive_balance}, ${res.client.account.reward_hbd_balance}, ${res.client.account.reward_vesting_hive.split(' ')[0]} HP = ${res.client.account.reward_vesting_balance}`;
      } else {
        ;
      }
    });


  }

  claimRewards() {
    let body = new FormData;
    body.append('hive_username', localStorage.getItem('hive_username'));
    body.append('user_id', localStorage.getItem('userId'));
    this.userDetailsService.claimRewards(body).then((res: any) => {
      console.log(res);
      if (res.client) {
        this.toastr.success('Rewards claimed.')
      } else {
        this.toastr.error('Could not claim rewards.')
      }
    });
  }

  triggerHive(episode) {
    this.confirmationDialogService.confirm('Please confirm..', this.getMessageBasedonHive(episode.hive_status), 'Proceed', 'Cancel')
      .then((confirmed) => {
        console.log('User confirmed:', confirmed);
        let body1 = new FormData;
        body1.append('episode_id', episode.id);
        this.homeDashboardService.manualHivePublish(body1).subscribe((res: any) => {
          if (res.msg) {
            this.toastr.error(res.msg);

          } else {
            // this.addToSelectedCommunity(community);
          }
        });
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  getCommunityData() {
    let getAllCommunity = this.homeDashboardService.getAllCommunity();
    let getFollowedCommunity = this.homeDashboardService.getFollowedCommunity(localStorage.getItem('userId'));
    let getCreatedCommunity = this.homeDashboardService.getCreatedCommunity(localStorage.getItem('userId'));
    this.isCommunityLoaded = false;
    forkJoin([getAllCommunity, getFollowedCommunity, getCreatedCommunity]).subscribe((results: any) => {
      this.isCommunityLoaded = true;
      this.allCommunity = results[0].allCommunity;
      this.allFollowedCommunity = results[1].allCommunity;
      this.allCreatedCommunity = results[2].allCommunity;
    });
  }

  followCommunity(community) {
    let body1 = new FormData;
    body1.append('community_id', community.id);
    body1.append('user_id', localStorage.getItem('userId'));
    this.homeDashboardService.subscribeCommunity(body1).subscribe((res: any) => {
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        this.getCommunityData();
      }
    });
  }

  getUserDetails() {
    this.userDetailsService.getUserDetails(localStorage.getItem('userId')).then((res: any) => {
      console.log(res);
      this.userDetailsService.UserDetails = res.users;
      this.userDetails = res.users;
      this.profileForm.controls['fullname'].setValue(this.userDetails.fullname);
      this.profileForm.controls['bio'].setValue(this.userDetails.settings.Account.Bio);
    });
  }

  redirectToEmbed(episode_id) {
    this.router.navigateByUrl('embed/' + episode_id);
  }

  onSubmit(data) {
    console.log(data);
    let body = new FormData;
    body.append('username', data.username);
    body.append('password', data.password);
    this.userDetails.fullname = data.fullname;
    this.userDetails.settings.Account.Bio = data.bio;
    this.updateUser();
  }

  getMessageBasedonHive(status) {
    switch (status) {
      case 'invalid':
        return 'This episode is not auto-publish to Hive. However you may choose to publish on Hive manually.'
      default:
        return null;
    }
  }

  updateUser() {
    this.isImageUploading = true;
    let body = new FormData;
    body.append('user_id', localStorage.getItem('userId'));
    body.append('img', this.userDetails.img);
    body.append('fullname', this.userDetails.fullname);
    body.append('settings_Account_Bio', this.userDetails.settings.Account.Bio);
    this.userDetailsService.updateUser(body).then((res) => {
      console.log(res);
      this.isImageUploading = false;
      this.getUserDetails();
      this.isProfileFormOpen = false;
    })
  }

  getAvatarText(name) {
    if (name) {
      let avatar = '';
      name.split(' ').forEach(element => {
        avatar = avatar + element[0];
      });
      return avatar;
    } else {
      return '';
    }
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      this.isImageUploading = true;
      let body = new FormData;
      body.append('imageBlob', file, file.name);
      this.userDetailsService.uploadImage(body).then((res: any) => {
        console.log(res);
        this.isImageUploading = false;
        if (res.imageUrl) {
          this.userDetails.img = res.imageUrl.url;
          this.updateUser();
        } else {
          this.toastr.error('Could not upload profile image');
        }
      })
    }
  }

  getErrorFullname(form) {
    return form.get('fullname').hasError('required') ? 'Field is required' : '';
  }

  openCommentDialog(episode_id): void {
    this.dialog.open(SelectCommunityComponent, {
      width: '400px',
      height: '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { episodeId: episode_id }
    });
  }

  tabChanged(tabChangeEvent: number) {
    if (tabChangeEvent) {
      this.currentTab = 'Communities';
    } else {
      this.currentTab = 'Podcasts';
    }
    console.log(this.currentTab);
  }

  communityTabChanged(tabChangeEvent: number) {
    console.log(this.currentTab);
  }

}
