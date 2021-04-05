import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import {HomeDashboardService} from 'src/app/pages/home-dashboard/home-dashboard.service';
import * as FormData from 'form-data';
@Component({
  selector: 'app-hive-token',
  templateUrl: './hive-token.component.html',
  styleUrls: ['./hive-token.component.scss']
})
export class HiveTokenComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router,
    private homeDashboardService : HomeDashboardService, public authService: AuthService, private toastr: ToastrService) { }

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
      this.homeDashboardService.userAuth(body).subscribe((res:any) => {
          localStorage.setItem('access_token',res.userData.hiveAccessToken);
          localStorage.setItem('userId',res.userData.id);
          localStorage.setItem('userName',res.userData.username);
          localStorage.setItem('hive_username',res.userData.hive_username);
          localStorage.setItem('token',res.userData.token);
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
