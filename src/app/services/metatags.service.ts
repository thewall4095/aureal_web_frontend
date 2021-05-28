import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetatagsService {

  constructor(
    private metaTagService: Meta
  ) { }

  defaultTags(){
    document.title = 'Aureal - The podcast platform that pays you';
    this.metaTagService.addTags([
      { charset: 'UTF-8' },
      { name: 'title', content: 'Aureal - The podcast platform that pays you' }, //
      { name: 'description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' }, //
      { name: 'keywords', content: 'Monetise Podcasts, Podcasts, itunes, Hive, decentralised, web 3.0, earn rewards, interactions' }, //
      { property: 'og:url', content: 'https://aureal.one' }, //
      { property: 'og:title', content: 'Aureal - The podcast platform that pays you' },
      { property: 'og:description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' },
      { property: 'og:image', content: 'https://aurealbucket.s3.us-east-2.amazonaws.com/aureal_full_dark.png' },
      { property: 'og:image:width', content: '200' },
      { property: 'og:image:height', content: '55' },
      { property: 'twitter:title', content: 'Aureal - The podcast platform that pays you' },
      { property: 'twitter:description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' },
      { property: 'twitter:image', content: 'https://aurealbucket.s3.us-east-2.amazonaws.com/aureal_full_dark.png' },
      { property: 'og:site_name', content: 'Aureal' },
    ]);
  }

  assignTags(title?, description?, url?, image?){
    if(title){
      document.title = title;
      this.metaTagService.updateTag(
        { name: 'title', content: title },
      );
      this.metaTagService.updateTag(
        { property: 'og:title', content: title },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:title', content: title },
      );
    }else{
      document.title = 'Aureal - The podcast platform that pays you';
      this.metaTagService.updateTag(
        { name: 'title', content: 'Aureal - The podcast platform that pays you' },
      );
      this.metaTagService.updateTag(
        { property: 'og:title', content: 'Aureal - The podcast platform that pays you' },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:title', content: 'Aureal - The podcast platform that pays you' },
      );
    }
    if(description){
      this.metaTagService.updateTag(
        { name: 'description', content: description },
      );
      this.metaTagService.updateTag(
        { property: 'og:description', content: description },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:description', content: description },
      );
    }else{
      this.metaTagService.updateTag(
        { name: 'description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' },
      );
      this.metaTagService.updateTag(
        { property: 'og:description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:description', content: 'Monetise your podcasts easily without ads or sponsorships on decentralised platform.' },
      );
    }
    if(url){
      this.metaTagService.updateTag(
        { property: 'og:url', content: url },
      );
    }else{
      this.metaTagService.updateTag(
        { property: 'og:url', content: 'https://aureal.one' },
      );
    }
    if(image){
      this.metaTagService.updateTag(
        { property: 'og:image', content: image },
      );
      this.metaTagService.updateTag(
        { property: 'og:image:width', content: '200' },
      );
      this.metaTagService.updateTag(
        { property: 'og:image:height', content: '200' },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:image', content: image },
      );
    }else{
      this.metaTagService.updateTag(
        { property: 'og:image', content: 'https://aurealbucket.s3.us-east-2.amazonaws.com/aureal_full_dark.png' },
      );
      this.metaTagService.updateTag(
        { property: 'og:image:width', content: '200' },
      );
      this.metaTagService.updateTag(
        { property: 'og:image:height', content: '55' },
      );
      this.metaTagService.updateTag(
        { property: 'twitter:image', content: 'https://aurealbucket.s3.us-east-2.amazonaws.com/aureal_full_dark.png' },
      );
    }
  }
}
