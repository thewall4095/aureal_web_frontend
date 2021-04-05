import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as FormData from 'form-data';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  otpForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoginFormShown: Boolean = true;
  isOtpFormShown: Boolean = false;
  isForgotPassword: Boolean = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  otherErrors = '';
  isbuttonLoaderOn = false;

  constructor(public authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]), //this.checkPassword]),
    });
    this.signupForm = new FormGroup({
      'mobile': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'fullname': new FormControl('', [Validators.required]),
      'dob': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, this.checkPassword]),
    });
    this.otpForm = new FormGroup({
      'otp': new FormControl('', [Validators.required, this.checkOtp]),
    });
    this.forgotPasswordForm = new FormGroup({
      'mobile': new FormControl('', [Validators.required]),
    });
  }

  getErrorUsername(form) {
    return form.get('username').hasError('required') ? 'Field is required' : '';
  }

  getErrorFullname(form) {
    return form.get('fullname').hasError('required') ? 'Field is required' : '';
  }

  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkOtp(control) {
    let enteredPassword = control.value
    let passwordCheck = /^[0-9]{1,6}$/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorPassword(form) {
    // return form.get('password').hasError('required') ? 'Field is required' : '';
    return form.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      form.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  getErrorOtp(form) {
    // return form.get('password').hasError('required') ? 'Field is required' : '';
    return form.get('otp').hasError('required') ? 'OTP is required' :
      form.get('otp').hasError('requirements') ? 'OTP needs to be at least 6 digits and all numeric' : '';
  }

  onSubmit(data) {
    console.log(data);
    let body = new FormData;
    body.append('username', data.username);
    body.append('password', data.password);
    this.isbuttonLoaderOn = true;
    this.authService.loginUser(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        // localStorage.setItem('token', res['token']);
        localStorage.setItem('userId', res['user']['id']);
        localStorage.setItem('userName', res['user']['username']);
        localStorage.setItem('mobile', res['user']['mobile']);
        localStorage.setItem('hive_username', res['user']['hive_username']);

        this.toastr.success('Logging you in');
        if (res['access_token']) {
          localStorage.setItem('access_token', res['access_token']);
        }
        localStorage.setItem('token', res['token']);
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 2000);

      }
    })

  }

  onSubmitSignup(data) {
    console.log(data);
    this.isbuttonLoaderOn = true;
    let body = new FormData;
    body.append('mobile', data.mobile.e164Number);
    body.append('password', data.password);
    body.append('password2', data.password);
    body.append('username', data.username);
    body.append('fullname', data.fullname);
    body.append('date_of_birth', data.dob);

    this.authService.registerUser(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;

      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        // localStorage.setItem('token', res['token']);
        localStorage.setItem('userId', res['user']['id']);
        localStorage.setItem('userName', res['user']['username']);
        localStorage.setItem('mobile', res['user']['mobile']);
        this.isbuttonLoaderOn = true;
        body = new FormData;
        body.append('user_id', res['user']['id']);
        body.append('mobile', res['user']['mobile']);
        this.authService.sendOtp(body).subscribe((res: any) => {
          this.isbuttonLoaderOn = false;

          if (res.msg) {
            this.toastr.error(res.msg);
          } else {
            this.isOtpFormShown = true;
          }
        })

      }
      console.log(res);
    })
  }

  onSubmitOtp(data) {
    console.log(data);
    let body = new FormData;
    body.append('user_id', localStorage.getItem('userId'));
    body.append('otp', data.otp);
    this.isbuttonLoaderOn = true;
    this.authService.verifyOtp(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else if (res['user'] == null) {
        this.toastr.error("User doesn't exist");
      } else {
        this.toastr.success('Logging you in');
        localStorage.setItem('token', res['token']);
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 3000);
      }
    })
  }

  onSubmitForgotPasswordForm(data) {
    let body = new FormData;
    body.append('mobile', '+16158877845');
    this.isbuttonLoaderOn = true;
    this.authService.sendResetOtp(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        localStorage.setItem('userId', res['data']['user_id']);
        localStorage.setItem('userName', res['data']['username']);
        this.isOtpFormShown = true;
      }
    })
  }

}
