import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';
import { Router } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import * as moment_ from 'moment';
import { MatDialog } from "@angular/material/dialog";
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  yourrooms;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
    private router: Router,
    private roomsService: RoomsService,
    public dialog: MatDialog,
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    this.metatagsService.defaultTags();
    this.roomsService.getUserRooms(localStorage.getItem('userId')).subscribe((res:any) => {
      this.yourrooms = res.data;
    })
  }

  ngOnInit(): void {
  }

  navigateCreateRoom() {
    this.router.navigate(['rooms-create']);
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

  isPaidOut(datee){
    return moment_().diff(datee) > 0;
  }

  shareRoom(room){
    this.dialog.open(SocialShareComponent, {
      width: '400px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { type: 'room', attributes: room }
    });
  }

  joinRoom(room){
    this.router.navigate(['rooms-live', room.roomid]);
  }
}
