import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomsService } from 'src/app/services/rooms.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-rooms-create',
  templateUrl: './rooms-create.component.html',
  styleUrls: ['./rooms-create.component.scss']
})
export class RoomsCreateComponent implements OnInit {
  roomForm: FormGroup;
  roomFormSubmitting: Boolean = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  isImageUploading= false;

  constructor(
    public roomsService: RoomsService,
    private router: Router,
    private userDetailsService: UserDetailsService,
  ) { }

  ngOnInit(): void {
    this.roomForm = new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'description': new FormControl('', []),
      // 'timedate': new FormControl('', []),
      // 'type': new FormControl('public', []),
      'image': new FormControl('', []),
    });
  }


  readURL(event){
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
          this.roomForm.controls['image'].setValue(res.imageUrl.url);
        } else {
        }
      })
    }
  }


  onSubmit(data) {
    console.log(data);
    let body = new FormData;
    body.append('title', data.title);
    body.append('description', data.description);
    // body.append('scheduledtime', data.timedate);
    body.append('imageurl', this.roomForm.get('image').value);
    body.append('hostuserid', localStorage.getItem('userId'));
    this.roomsService.createRoom(body).subscribe((res:any) => {
      this.router.navigate(['rooms-live', res.data.roomid]);
    });
  }

}
