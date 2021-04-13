import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HomeDashboardService } from 'src/app/pages/home-dashboard/home-dashboard.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import * as FormData from 'form-data';
@Component({
  selector: 'app-hive-token-register',
  templateUrl: './hive-token-register.component.html',
  styleUrls: ['./hive-token-register.component.scss']
})
export class HiveTokenRegisterComponent implements OnInit {
  constructor(private route: ActivatedRoute, public router: Router,
    private homeDashboardService: HomeDashboardService, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get("code")) {
      let body = new FormData;
      body.append('hive_username', this.route.snapshot.queryParamMap.get("username"));
      body.append('user_id', localStorage.getItem('userId'));
      body.append('code', this.route.snapshot.queryParamMap.get("code"));
      this.toastr.success('Loading..');
      this.authService.registerHiveUser(body).subscribe((res: any) => {
        if (res.msg) {
          this.toastr.error(res.msg);
        } else {

          localStorage.setItem('hive_username', this.route.snapshot.queryParamMap.get("username"));
          localStorage.setItem('access_token', res.access_token);
          this.router.navigateByUrl('/');
        }
      })
    } else {
      this.toastr.error('Something went wrong');
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 3000);
    }


  }
}
