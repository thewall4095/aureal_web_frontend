import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ThemeService } from 'src/app/services/theme.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { Clipboard } from "@angular/cdk/clipboard"

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  ownReferralLink;
  referCount;
  copied:Boolean = false;

  foundRefCode;
  cnt = 5;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private themeService: ThemeService,
    public userDetailsService: UserDetailsService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParamMap.get("username"));
    this.foundRefCode = this.route.snapshot.queryParamMap.get("refCode");
    if(this.foundRefCode){
      localStorage.setItem('used_referal_code', this.foundRefCode);
      this.getStarted();
    }
   
    setTimeout(()=>{
      if(this.authService.isAuthenticated()){
        this.getUserDetails();
        this.getPersonalReferralLink();
      }
    },1000);
  }

  getStarted(){
    if (!this.authService.isAuthenticated()) {
      if(window.innerWidth < 756) {
        this.router.navigateByUrl('/home');
      }else{
        this.openHiveAuthDialog(true);
      }
    }else{
      // this.router.navigateByUrl('/home');
    }
  }

  openHiveAuthDialog(autoCheck: Boolean): void {
    this.dialog.open(HiveAuthComponent, {
      width: '800px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { autoCheck: autoCheck, fromReferral : true }
    });
  }

  toggleTheme(isDark){
    this.themeService.theme = isDark ? 'dark' : null;
  }

  get dark() {
    return this.themeService.theme === 'dark';
  }

  getUserDetails(){
    if (!this.userDetailsService.UserDetails && this.authService.isAuthenticated()) {
      this.userDetailsService.getUserDetails(localStorage.getItem('userId')).then((res: any) => {
        console.log(res);
        this.userDetailsService.UserDetails = res.users;
      });
    }
  }

  getPersonalReferralLink() {
    this.userDetailsService.getPersonalReferralLink().then((res:any) =>{
      console.log(res);
      if(res.data.code)
        this.ownReferralLink = 'https://aureal.one/referral?refCode='+res.data.code;    
        this.referCount = res.data.refer_count;    
    });
  }
  navigateProfile(){
    this.router.navigateByUrl('/profile');
  }

  copyReferralLink(){
    this.clipboard.copy(this.ownReferralLink);
    this.copied = true;
  }

  shareReferral(){
    
  }
}
