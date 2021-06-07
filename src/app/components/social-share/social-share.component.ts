import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit {
  url = 'https://aureal.one';
  image = 'https://aureal.one';
  description = "Hey there I'm listening to ";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    if (data.type == 'episode') {
      this.url = 'https://aureal.one/episode/'+ data.attributes.id;
      this.image = data.attributes.image;
      this.description = this.description + data.attributes.name + ' on Aureal';
    } else {
      this.url = 'https://aureal.one/podcast/' + data.attributes.id
      this.image = data.attributes.image;
      this.description = this.description + data.attributes.name + ' by ' + data.attributes.author + ' on Aureal';
    }
  }

  ngOnInit(): void {
  }

}
