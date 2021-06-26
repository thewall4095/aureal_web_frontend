import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {CommonService} from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-hive-token-register',
  templateUrl: './hive-token-register.component.html',
  styleUrls: ['./hive-token-register.component.scss']
})
export class HiveTokenRegisterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private commonService : CommonService,
    public authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
    ) {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      this.metatagsService.defaultTags();
    }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get("code")) {
      let body = new FormData;
      body.append('hive_username', this.route.snapshot.queryParamMap.get("username"));
      body.append('user_id', localStorage.getItem('userId'));
      body.append('code', this.route.snapshot.queryParamMap.get("code"));
      let used_referal_code = localStorage.getItem('used_referal_code');
      if(used_referal_code){
        body.append('used_referal_code', used_referal_code);
      }
      this.toastr.success('Loading...');
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
