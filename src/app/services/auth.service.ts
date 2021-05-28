import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  constructor(private api: ApiService, private socialAuthService: SocialAuthService, private router: Router
  ) { }

  googleSignin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  registerUser(body) {
    return this.api.post(this.apiUrl + '/public/register', body);
  }

  loginUser(body) {
    return this.api.post(this.apiUrl + '/public/login', body);
  }

  sendOtp(body) {
    return this.api.post(this.apiUrl + '/public/sendOTP', body);
  }

  verifyOtp(body) {
    return this.api.post(this.apiUrl + '/public/verifyOTP', body);
  }

  sendResetOtp(body) {
    return this.api.post(this.apiUrl + '/public/sendResetOTP', body);
  }

  isAuthenticated() {
    return localStorage.getItem('token') ? true : false;
  }

  isHiveConnected() {
    return localStorage.getItem('access_token');
    // return localStorage.getItem('access_token') && (parseInt(localStorage.getItem('hive_expiry')) - moment().unix() > 0) ? true : false;
  }

  getUsername() {
    return localStorage.getItem('userName');
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
    setTimeout(()=>{
      location.reload();
    },100);
  }

  registerHiveUser(body) {
    return this.api.post(this.apiUrl + '/public/addHiveUser', body);
  }
}
