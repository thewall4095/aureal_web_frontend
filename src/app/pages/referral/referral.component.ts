import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from "@angular/router";
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public authService: AuthService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
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
}
