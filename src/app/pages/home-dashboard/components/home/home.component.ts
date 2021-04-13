import { Component, OnInit } from '@angular/core';
import { HomeDashboardService } from 'src/app/pages/home-dashboard/home-dashboard.service';

import { PlayerService } from 'src/app/services/player.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  progress = true;
  browseEpisodes;
  browseHiveEpisodes;
  upcomingPodcastData;
  //scroll
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  //paginate
  page = 0;
  pageHive = 0;
  pageSize = 10;
  loadingMoreEpisodes = false;
  loadingMoreHiveEpisodes = false;
  loadingUpcomingPodcasts = true;
  categories = [];
  selectedCategory = null;
  constructor(private homeDashboardService: HomeDashboardService, private route: ActivatedRoute,
    public playerService: PlayerService, private router: Router
    , private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Aureal - The new way of podcast monetisation');
    this.metaService.addTags([
      { name: 'keywords', content: 'Podcast rating platform, Decentralised Podcasting' }, //tags
      { name: 'og:locale', content: 'en' },
      { name: 'og:title', content: 'Aureal' }, // episode/podcast name
      { name: 'Description', content: 'The new way of podcast monetisation' }, // episode/podcast desciption
      { name: 'og:description', content: 'The new way of podcast monetisation' }, // episode/podcast desciption
      { name: 'og:url', content: 'https://app.aureal.one' }, // episode/podcast desciption
      { name: 'og:site_name', content: 'Aureal - Podcast Rating Platform' }, // episode/podcast desciption
      { name: 'og:image', content: 'https://aureal.one/wp-content/uploads/2019/04/Aureal-Logo-light-1024x291.png' }, // episode/podcast image
      { name: 'twitter:card', content: 'summary_large_image' }, // episode/podcast image
      { name: 'twitter:image', content: 'https://aureal.one/wp-content/uploads/2019/04/Aureal-Logo-light-1024x291.png' }, // episode/podcast image
      { name: 'twitter:title', content: 'Aureal' }, // episode/podcast image
      { name: 'og:image', content: 'https://aureal.one/wp-content/uploads/2019/04/Aureal-Logo-light-1024x291.png' }, // episode/podcast image
      { name: 'og:image', content: 'https://aureal.one/wp-content/uploads/2019/04/Aureal-Logo-light-1024x291.png' }, // episode/podcast image
      { name: 'robots', content: 'index, follow' }
    ]);
  }

  ngOnInit(): void {
    let browseEpisodes = this.homeDashboardService.browseEpisodes(this.page, this.pageSize);
    let browseHiveEpisodes = this.homeDashboardService.browseHiveEpisodes(this.page, this.pageSize);
    this.homeDashboardService.getCategories().subscribe((res: any) => {
      console.log(res);
      this.categories = res.allCategory;
    });

    forkJoin([browseHiveEpisodes, browseEpisodes]).subscribe((results: any) => {
      this.progress = false;
      this.browseHiveEpisodes = results[0].EpisodeResult;
      this.browseEpisodes = results[1].EpisodeResult;
      // this.discoverData = this.discoverData.concat(results[0].EpisodeResult);
    });
    // this.homeDashboardService.browseEpisodes(this.page,this.pageSize).subscribe((res:any) => {
    //   this.progress = false;
    //   if(res.EpisodeResult){
    //     this.discoverData = res.EpisodeResult;
    //   }
    //   console.log(res);
    // });
    this.homeDashboardService.browsePodcasts(this.page, this.pageSize).subscribe((res: any) => {
      this.loadingUpcomingPodcasts = false;
      if (res.PodcastResult) {
        this.upcomingPodcastData = res.PodcastResult;
      }
      console.log(res);
    });
  }

  getEpisodes() {
    this.progress = true;
    if (this.selectedCategory && this.selectedCategory.id) {
      this.homeDashboardService.categoryBasedEpisodes(this.page, this.pageSize, this.selectedCategory.id.toString()).subscribe((res: any) => {
        console.log(res);
        this.progress = false;
        this.browseEpisodes = res.EpisodeList;
      });
    } else {
      this.homeDashboardService.browseEpisodes(this.page, this.pageSize).subscribe((res: any) => {
        console.log(res);
        this.progress = false;
        this.browseEpisodes = res.EpisodeResult;
      });
    }
  }

  selectCategory(category) {
    if ((this.selectedCategory == null) || (this.selectedCategory.id != category.id)) {
      this.selectedCategory = category;
    } else {
      this.selectedCategory = null;
    }
    this.getEpisodes();
  }

  onScrollDown() {
    console.log('here')
    this.page += 1;
    this.loadingMoreEpisodes = true;
    // this.getEpisodes();
    if (this.selectedCategory && this.selectedCategory.id) {
      this.homeDashboardService.categoryBasedEpisodes(this.page, this.pageSize, this.selectedCategory.id.toString()).subscribe((res: any) => {
        console.log(res);
        this.loadingMoreEpisodes = false;
        this.browseEpisodes = this.browseEpisodes.concat(res.EpisodeList);
      });
    } else {
      this.homeDashboardService.browseEpisodes(this.page, this.pageSize).subscribe((res: any) => {
        console.log(res);
        this.loadingMoreEpisodes = false;
        this.browseEpisodes = this.browseEpisodes.concat(res.EpisodeResult);
      });
    }
  }

  onScrollDownHive() {
    console.log('here')
    this.pageHive += 1;
    this.loadingMoreHiveEpisodes = true;
    // this.getEpisodes();
    if (this.selectedCategory && this.selectedCategory.id) {
      this.homeDashboardService.categoryBasedEpisodes(this.pageHive, this.pageSize, this.selectedCategory.id.toString()).subscribe((res: any) => {
        console.log(res);
        this.loadingMoreHiveEpisodes = false;
        this.browseHiveEpisodes = this.browseHiveEpisodes.concat(res.EpisodeList);
      });
    } else {
      this.homeDashboardService.browseHiveEpisodes(this.pageHive, this.pageSize).subscribe((res: any) => {
        console.log(res);
        this.loadingMoreHiveEpisodes = false;
        this.browseHiveEpisodes = this.browseHiveEpisodes.concat(res.EpisodeResult);
      });
    }
  }


  redirectToPodcast(podcast) {
    this.router.navigateByUrl('podcast/' + podcast.id);
  }

}
