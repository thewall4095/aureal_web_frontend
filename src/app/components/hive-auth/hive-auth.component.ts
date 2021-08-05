import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
// import * as keychain from '@hiveio/keychain';
import { ReferralInputComponent } from 'src/app/components/referral-input/referral-input.component';
import { MatDialog } from "@angular/material/dialog";
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-hive-auth',
  templateUrl: './hive-auth.component.html',
  styleUrls: ['./hive-auth.component.scss']
})
export class HiveAuthComponent implements OnInit {
  autoCheck: Boolean = false;
  justHiveLogin:Boolean = false;
  fromReferral:Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<HiveAuthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public userDetailsService: UserDetailsService,
  ) {
    console.log(data);
    this.autoCheck = data.autoCheck;
    if(data?.fromReferral){
      this.fromReferral = true;
    }
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated() && !this.authService.isHiveConnected()){
      this.justHiveLogin = true;
    }
  }


  connectHive(toConnectGoogleAccount) {
    let redirectUrl = 'http://'+window.location.hostname+'/hive-token';
    if (environment.production) {
      redirectUrl = 'https://'+window.location.hostname+'/hive-token';
    }
    if (toConnectGoogleAccount) {
      redirectUrl += '-register';
    }
    window.open('https://hivesigner.com/oauth2/authorize?client_id=aureal&response_type=code&redirect_uri=' + redirectUrl + '&scope=vote,comment,comment_option,custom_json', '_self');
  }

  signIn(type){
    this.userDetailsService.getUsedReferralInfo().then((res:any)=>{
      if(res.success){
        this.connectHive(true);
      }else{
        this.dialog.open(ReferralInputComponent, {
          width: '400px',
          height:  '400px',
          maxWidth: '95vw',
          hasBackdrop: true,
          data: { type: type, connectHive : false }
        });
      }
    });

    // if(type=='google'){
    //   this.authService.googleSignin();
    // }else{
    //   if(this.authService.isAuthenticated() && !this.authService.isHiveConnected())
    //     this.connectHive(true);
    //   else
    //     this.connectHive(false);
    // }
  }
  routeto(url){
    this.dialogRef.close();
    this.router.navigateByUrl(url);
  }

  // async triggerKeychain(){
  //   let a = await keychain.isKeychainInstalled(window);
  //   console.log(a);
  // }
}
