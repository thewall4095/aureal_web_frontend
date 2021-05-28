import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
    ) { 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  ngOnInit(): void {
    this.metatagsService.defaultTags();
  }

}
