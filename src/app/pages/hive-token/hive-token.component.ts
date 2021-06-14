import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import {CommonService} from 'src/app/services/common.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-hive-token',
  templateUrl: './hive-token.component.html',
  styleUrls: ['./hive-token.component.scss']
})
export class HiveTokenComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router, 
    private commonService : CommonService,
    public authService: AuthService,
    private toastr: ToastrService,
    public userDetailsService: UserDetailsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
    ) {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      this.metatagsService.defaultTags();
    }

  ngOnInit(): void {
    // console.log(this.route.snapshot.queryParamMap.get("access_token"));
    // console.log(this.route.snapshot.queryParamMap.get("expires_in"));
    console.log(this.route.snapshot.queryParamMap.get("username"));
    let code = this.route.snapshot.queryParamMap.get("code");

    console.log(moment().unix()/1000);
    if(this.route.snapshot.queryParamMap.get("code")){
      let body = new FormData;
      body.append('identifier', this.route.snapshot.queryParamMap.get("code"));
      body.append('loginType', 'hive');
      let used_referal_code = localStorage.getItem('used_referal_code');
      if(used_referal_code){
        body.append('used_referal_code', used_referal_code);
      }
      this.commonService.userAuth(body).subscribe((res:any) => {
          localStorage.removeItem('used_referal_code');
          localStorage.setItem('access_token',res.userData.hiveAccessToken);
          localStorage.setItem('userId',res.userData.id);
          localStorage.setItem('userName',res.userData.username);
          localStorage.setItem('hive_username',res.userData.hive_username);
          localStorage.setItem('token',res.userData.token);
          this.userDetailsService.UserDetails = res.userData;
          this.router.navigateByUrl('/');
      })
    }else{
      this.toastr.error('Something went wrong');
      setTimeout(()=>{
        this.router.navigateByUrl('/');
      },3000);
    }


  }

}
