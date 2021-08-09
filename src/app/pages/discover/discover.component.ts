import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {CommonService} from 'src/app/services/common.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  animations:[
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
    ])
  ]
})
export class DiscoverComponent implements OnInit {
  topPodcasts : any = [];

  current = 0;
  currentTab = 0;
  tabsSection = [
    {
      name : 'User Podcasts',
      data : [],
      type : 'podcasts',
      isLoaded: false,
      page: -1,
      pageSize: 8
    },
    {
      name : 'Recommended Podcasts',
      data : [],
      type : 'podcasts',
      isLoaded: false,
      page: -1,
      pageSize: 5
    },
    {
      name : 'Trending on Hive',
      data : [],
      type : 'episodes',
      isLoaded: false,
      page: -1,
      pageSize: 14
    },
    {
      name : 'Recently played',
      data : [],
      type : 'episodes',
      isLoaded: false,
      page: -1,
      pageSize: 5
    },
  ]
  constructor(
    private commonService : CommonService,
    public authService: AuthService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
    public router: Router,
    public dialog: MatDialog,
  ) { 
    this.metatagsService.defaultTags();
  }

  ngOnInit(): void {
    this.getFollowedEpisodes();
    this.getHiveEpisodes();
    if(this.authService.isAuthenticated()){
      this.getRecommendedPodcasts();
    }
  }

  getFollowedEpisodes(){
    this.tabsSection[0].isLoaded = false;
    this.tabsSection[0].page +=1;
    this.commonService.getFollowedEpisodes(localStorage.getItem('userId'), this.tabsSection[0].page, this.tabsSection[0].pageSize).subscribe((res:any) => {
      this.tabsSection[0].isLoaded = true;
      if(res.episodes){
        this.tabsSection[0].data = res.episodes;
      }
    })
  }

  getHiveEpisodes(){
    this.tabsSection[2].page +=1;
    this.tabsSection[2].isLoaded = false;
    this.commonService.browseHiveEpisodes(this.tabsSection[2].page, this.tabsSection[2].pageSize).subscribe((res:any) => {
      this.tabsSection[2].isLoaded = true;
      if(res.EpisodeResult){
        this.tabsSection[2].data = [...this.tabsSection[2].data, ...res.EpisodeResult];
      }
    })
  }

  // getNewlyReleasedPodcasts(){
  //   this.tabsSection[1].isLoaded = false;
  //   this.commonService.getNewlyReleasedPodcasts(0, 10).subscribe((res:any) => {
  //     this.tabsSection[1].isLoaded = true;
  //     if(res.newest){
  //       this.tabsSection[1].data = res.newest;
  //     }
  //   })
  // }

  // getRecentlyPlayedEpisodes(){
  //   this.tabsSection[2].isLoaded = false;
  //   this.commonService.getRecentlyPlayedEpisodes(0, 10).subscribe((res:any) => {
  //     this.tabsSection[2].isLoaded = true;
  //     if(res.recently){
  //       this.tabsSection[2].data = res.recently;
  //     }
  //   })
  // }

  // getPopularTrendingPodcasts(){
  //   this.tabsSection[1].page +=1;
  //   this.tabsSection[1].isLoaded = false;
  //   this.commonService.getPopularTrendingPodcasts(this.tabsSection[1].page, this.tabsSection[1].pageSize).subscribe((res:any) => {
  //     this.tabsSection[1].isLoaded = true;
  //     if(res.trending){
  //       this.tabsSection[1].data = res.trending;
  //     }
  //   })
  // }

  getRecommendedPodcasts(){
    this.tabsSection[1].page +=1;
    this.tabsSection[1].isLoaded = false;
    this.commonService.getRecommendedPodcasts(this.tabsSection[1].page, this.tabsSection[1].pageSize).subscribe((res:any) => {
      this.tabsSection[1].isLoaded = true;
      if(res.for_you){
        this.tabsSection[1].data = res.for_you;
      }
    })
  }

  rightScroll(e){
    let wrapper = e.srcElement.closest('.discover-container');
    wrapper.querySelector('.scrollable-episodes-1').scroll({
      left: wrapper.querySelector('.scrollable-episodes-1').offsetWidth, 
      behavior: 'smooth' 
    });
    // wrapper.querySelector('.scrollable-episodes-1').scrollLeft += wrapper.querySelector('.scrollable-episodes-1').offsetWidth;
  }

  leftScroll(e){
    let wrapper = e.srcElement.closest('.discover-container');
    console.log(wrapper.querySelector('.scrollable-episodes-1').scrollLeft);
    wrapper.querySelector('.scrollable-episodes-1').scroll({
      left: wrapper.querySelector('.scrollable-episodes-1').offsetWidth * -1, 
      behavior: 'smooth' 
    });
    // wrapper.querySelector('.scrollable-episodes-1').scrollLeft -= wrapper.querySelector('.scrollable-episodes-1').offsetWidth;

  }

  rightScroll2(e){
    // let wrapper = e.srcElement.closest('.discover-container');
    // console.log(wrapper.querySelector('.scrollable-episodes-2').offsetWidth * 0.8);
    // wrapper.querySelector('.scrollable-episodes-2').scroll({
    //   left: wrapper.querySelector('.scrollable-episodes-2').offsetWidth * 0.8, 
    //   behavior: 'smooth' 
    // });

    // wrapper.querySelector('.scrollable-episodes-1').scrollLeft += wrapper.querySelector('.scrollable-episodes-1').offsetWidth;
    if(this.current+4<=this.tabsSection[2].pageSize)
      this.current+=4;
    document.getElementById('point_'+this.current)?.scrollIntoView(
      { behavior: "smooth", block: "end", inline: "start" }
    );
  }

  leftScroll2(e){
    // let wrapper = e.srcElement.closest('.discover-container');
    // console.log(wrapper.querySelector('.scrollable-episodes-2').offsetWidth * -0.8);
    // wrapper.querySelector('.scrollable-episodes-2').scroll({
    //   left: wrapper.querySelector('.scrollable-episodes-2').offsetWidth * -0.8, 
    //   behavior: 'smooth' 
    // });
    // wrapper.querySelector('.scrollable-episodes-1').scrollLeft -= wrapper.querySelector('.scrollable-episodes-1').offsetWidth;
    if(this.current-4>=0)
      this.current-=4;
    document.getElementById('point_'+this.current)?.scrollIntoView(
      { behavior: "smooth", block: "end", inline: "start" }
    );
  }

  get dark() {
    return this.themeService.theme === 'dark';
  }

  getStarted(){
    if (!this.authService.isAuthenticated()) {
      if(window.innerWidth < 756) {
        this.router.navigateByUrl('/home');
      }else{
        this.openHiveAuthDialog(true);
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
}
