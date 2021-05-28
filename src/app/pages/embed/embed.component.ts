import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: "app-embed",
  templateUrl: "./embed.component.html",
  styleUrls: ["./embed.component.scss"],
})
export class EmbedComponent implements OnInit {
  progress: boolean = true;
  episodeId;
  episodeData;
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService : CommonService,
    private domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

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
      this.commonService.getBadge(this.episodeId).subscribe((res: any) => {
        console.log(res);
      })
    });

  }

  getBadgeHtml(preview: Boolean) {
    let abc = `<a href="https://aureal.one/episode/${this.episodeId}"
    target="_blank">
    <img src="https://api.aureal.one/public/getBadge?episode_id=${this.episodeId}&theme=light" alt="Aureal 2.0 - The podcast platform that rewards you for interactions | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
    </a>`;
    if (preview) {
      return this.domSanitizer.bypassSecurityTrustHtml(abc);
    } else {
      return abc;
    }
  }
}
