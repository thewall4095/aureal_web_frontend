import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RssFeedDetailsService } from 'src/app/services/rss-feed-details.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as moment_ from 'moment';
const moment = moment_;
import { ActivatedRoute, Router } from "@angular/router";
import * as FormData from 'form-data';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  linkForm: FormGroup;
  otpForm: FormGroup;

  isbuttonLoaderOn: Boolean = false;
  isOtpFormShown: Boolean = false;


  showSubmitForm: Boolean = true;
  displayedColumns = ['name', 'duration', 'status'];
  dataSources = [];
  podcasts = [];
  constructor(public authService: AuthService, public rssFeedDetailsService: RssFeedDetailsService, private toastr: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this.linkForm = new FormGroup({
      'link': new FormControl('', [Validators.required]),
    });
    this.otpForm = new FormGroup({
      'otp': new FormControl('', [Validators.required, this.checkOtp]),
    });

  }

  checkLink(control) {
    let enteredPassword = control.value
    let passwordCheck = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkOtp(control) {
    let enteredPassword = control.value
    let passwordCheck = /^[0-9]{1,6}$/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorLink(form) {
    return form.get('link').hasError('required') ? 'Link is required' :
      form.get('link').hasError('requirements') ? 'Link is not valid' : '';
    // return form.get('link').hasError('required') ? 'Field is required' : '';
  }

  getErrorOtp(form) {
    // return form.get('password').hasError('required') ? 'Field is required' : '';
    return form.get('otp').hasError('required') ? 'OTP is required' :
      form.get('otp').hasError('requirements') ? 'OTP needs to be at least 6 digits and all numeric' : '';
  }

  onSubmitLink(data) {
    let body = new FormData;
    body.append('url', data.link);
    body.append('user_id', localStorage.getItem('userId'));
    this.isbuttonLoaderOn = true;
    this.rssFeedDetailsService.validateRssFeed(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        this.isOtpFormShown = true;
        this.toastr.success("Feed validated");
        console.log('here');
      }
    });
  }

  onSubmitOtp(data) {
    console.log(data);
    let body = new FormData;
    body.append('user_id', localStorage.getItem('userId'));
    body.append('otp', data.otp);
    body.append('url', this.linkForm.value.link);

    this.isbuttonLoaderOn = true;

    this.rssFeedDetailsService.verifyOtpAndCreateRSS(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        this.toastr.success('Getting your podcast live...');
        setTimeout(() => {
          this.router.navigateByUrl('/profile');
        }, 3000);
      }
    })
  }

  formatDuration(seconds) {
    return (Math.floor(moment.duration(seconds, 'seconds').asHours()) > 0 ? Math.floor(moment.duration(seconds, 'seconds').asHours()) + ':' : '') + moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
  }

  redirectToProfile() {
    this.router.navigateByUrl('/profile');
  }

}
