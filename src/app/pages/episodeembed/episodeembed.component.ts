import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-episodeembed',
  templateUrl: './episodeembed.component.html',
  styleUrls: ['./episodeembed.component.scss']
})
export class EpisodeembedComponent implements OnInit {
  progress: boolean = true;
  episodeId;
  episodeData;
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService : CommonService,
  ) { }

  ngOnInit(): void {
    this.progress = true;
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.episodeId = paramMap.get("episode_id");
      this.commonService
        .getEpisode(this.episodeId)
        .subscribe((res: any) => {
          console.log(res);
          this.progress = false;
          this.episodeData = res.episode;
        });
    });
  }

}
