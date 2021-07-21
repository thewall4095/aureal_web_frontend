import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral-input',
  templateUrl: './referral-input.component.html',
  styleUrls: ['./referral-input.component.scss']
})
export class ReferralInputComponent implements OnInit {
  referralCode;
  validatingReferral:Boolean = false;
  type = '';
  referer = '';
  constructor(
    public dialogRef: MatDialogRef<ReferralInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService,
    public userDetailsService: UserDetailsService,
    private toastr: ToastrService,
  ) { 
    this.type = data?.type;
    if(data?.connectHive){
      this.type = 'hive';
    }
    this.referralCode = localStorage.getItem('used_referal_code');
    if(this.referralCode){
      this.validateReferral();
    }
  }

  ngOnInit(): void {
  }

  connectHive(toConnectGoogleAccount) {
    let redirectUrl = 'http://localhost:4201/hive-token';
    if (environment.production) {
      redirectUrl = 'https://aureal.one/hive-token';
    }
    if (toConnectGoogleAccount) {
      redirectUrl += '-register';
    }
    window.open('https://hivesigner.com/oauth2/authorize?client_id=aureal&response_type=code&redirect_uri=' + redirectUrl + '&scope=vote,comment,comment_option,custom_json', '_self');
  }

  validateReferral(){
    this.validatingReferral = true;
    let body = new FormData;
    body.append('code', this.referralCode);
    this.userDetailsService.validateReferral(body).then((res:any) =>{
      console.log(res);
      this.validatingReferral = false;
      if(res.success){
        localStorage.setItem('used_referal_code', this.referralCode);
        this.referer = res.referer;
        // this.proceed();
      }else{
        this.referralCode = '';
        this.toastr.error(res.msg);
      }
    })
  }

  removeReferrelCode(){
    localStorage.removeItem('used_referal_code');
    this.referralCode = '';
  }

  proceed(){
    if(this.type=='google'){
      this.authService.googleSignin();
    }else{
      if(this.authService.isAuthenticated() && !this.authService.isHiveConnected())
        this.connectHive(true);
      else
        this.connectHive(false);
    }
  }
}
