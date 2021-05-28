import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { RssFeedDetailsService } from 'src/app/services/rss-feed-details.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { SelectCommunityComponent } from 'src/app/components/select-community/select-community.component';// 'src/app/components/select-community/select-community.component';
import {CommonService} from 'src/app/services/common.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/services/auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

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
  episodesLoading: Boolean = false;
  page = 0;
  pageSize = 10;

  categoriesLoading: Boolean = false;
  categories = [];

  languagesLoading: Boolean = false;
  languages = [];

  constructor(
    private userDetailsService: UserDetailsService,
    public rssFeedDetailsService: RssFeedDetailsService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private commonService : CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    this.metatagsService.defaultTags();
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'bio': new FormControl('', []), //this.checkPassword]),
    });

    this.getUserDetails();
    this.rssFeedDetailsService.getSubmittedRssFeeds().subscribe((res: any) => {
      if (res.podcasts) {
        this.podcasts = res.podcasts;
        // this.podcasts.forEach(podcast => {
        //   podcast.Episodes.forEach(element => {
        //     element['Categories'] = podcast['Categories'];
        //     element['podcast_name'] = podcast['name'];
        //     element['author'] = podcast['author'];
        //   });
        // })
      }
    });
    this.userDetailsService.getUserHiveDetails().then((res: any) => {
      console.log('hererere', res.client.account.reward_vesting_hive.split(' ')[0]);
      if (res.client && res.client.account.reward_hive_balance.split(' ')[0] != '0.000' && res.client.account.reward_hbd_balance.split(' ')[0] != '0.000' && res.client.account.reward_vesting_hive.split(' ')[0] != '0.000') {
        this.unclaimedText = `Unclaimed balance for ${localStorage.getItem('hive_username')}: ${res.client.account.reward_hive_balance}, ${res.client.account.reward_hbd_balance}, ${res.client.account.reward_vesting_hive.split(' ')[0]} HP = ${res.client.account.reward_vesting_balance}`;
      } else {
        ;
      }
    });

    this.getCategoryLanguages();
  }

  getCategoryLanguages(){
    const getCategory = this.userDetailsService.getCategories();
    const getLanguage = this.userDetailsService.getLanguages();
    forkJoin([getCategory, getLanguage]).subscribe((results: any) => {
      console.log(results);
      results[0].Categories_you_like.forEach(element => {
        this.categories.push({
          id: element.id,
          name: element.name,
          follows : true
        })
      });
      results[0].Rest_all_categories.forEach(element => {
        this.categories.push({
          id: element.id,
          name: element.name,
          follows : false
        })
      });
      results[1].Language_you_like.forEach(element => {
        this.languages.push({
          id: element.id,
          name: element.name,
          follows : true
        })
      });
      results[1].Rest_all_Language.forEach(element => {
        this.languages.push({
          id: element.id,
          name: element.name,
          follows : false
        })
      });
    });
  }

  selectCategory(category){
    if(!category.follows){
      let body = new FormData;
      body.append('user_id', localStorage.getItem('userId'));
      body.append('category_ids', category.id+'_');
      this.userDetailsService.updateUserCategory(body).then((res:any)=>{
        category.follows = true;
      });
    }
  }
  removeSelectedCategory(category){
    if(category.follows){
      let body = new FormData;
      body.append('user_id', localStorage.getItem('userId'));
      body.append('category_ids', category.id+'_');
      body.append('operation', 'remove');
      this.userDetailsService.updateUserCategory(body).then((res:any)=>{
        category.follows = false;
      });
    }
  }
  selectLanguages(category){
    if(!category.follows){
      let body = new FormData;
      body.append('user_id', localStorage.getItem('userId'));
      body.append('lang_ids', category.id+'_');
      this.userDetailsService.updateUserLanguage(body).then((res:any)=>{
        category.follows = true;
      });
    }
  }
  removeSelectedLanguages(category){
    if(category.follows){
      let body = new FormData;
      body.append('user_id', localStorage.getItem('userId'));
      body.append('lang_ids', category.id+'_');
      body.append('operation', 'remove');
      this.userDetailsService.updateUserLanguage(body).then((res:any)=>{
        category.follows = false;
      });
    }
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
        this.commonService.manualHivePublish(body1).subscribe((res: any) => {
          if (res.msg) {
            this.toastr.error(res.msg);

          } else {
            // this.addToSelectedCommunity(community);
          }
        });
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  // getCommunityData() {
  //   let getAllCommunity = this.commonService.getAllCommunity();
  //   let getFollowedCommunity = this.commonService.getFollowedCommunity(localStorage.getItem('userId'));
  //   let getCreatedCommunity = this.commonService.getCreatedCommunity(localStorage.getItem('userId'));
  //   this.isCommunityLoaded = false;
  //   forkJoin([getAllCommunity, getFollowedCommunity, getCreatedCommunity]).subscribe((results: any) => {
  //     this.isCommunityLoaded = true;
  //     this.allCommunity = results[0].allCommunity;
  //     this.allFollowedCommunity = results[1].allCommunity;
  //     this.allCreatedCommunity = results[2].allCommunity;
  //   });
  // }

  // followCommunity(community) {
  //   let body1 = new FormData;
  //   body1.append('community_id', community.id);
  //   body1.append('user_id', localStorage.getItem('userId'));
  //   this.commonService.subscribeCommunity(body1).subscribe((res: any) => {
  //     if (res.msg) {
  //       this.toastr.error(res.msg);
  //     } else {
  //       this.getCommunityData();
  //     }
  //   });
  // }

  getUserDetails() {
    this.userDetailsService.getUserDetails(localStorage.getItem('userId')).then((res: any) => {
      console.log(res);
      this.userDetailsService.UserDetails = res.users;
      this.userDetails = res.users;
      this.profileForm.controls['username'].setValue(this.userDetails.username);
      this.profileForm.controls['bio'].setValue(this.userDetails.settings.Account.Bio);
    });
  }

  redirectToPost() {
    this.router.navigateByUrl('post');
  }

  redirectToPodcast(data) {
    this.router.navigateByUrl('podcast/'+data.id);
  }

  onSubmit(data) {
    console.log(data);
    let body = new FormData;
    body.append('username', data.username);
    body.append('password', data.password);
    this.userDetails.username = data.username;
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
    body.append('username', this.userDetails.username);
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

  getErrorusername(form) {
    return form.get('username').hasError('required') ? 'Field is required' : '';
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

  logout(){
    this.authService.logout();
  }
}
