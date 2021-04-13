import { Component, OnInit, ViewChild,  } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { SwUpdate } from '@angular/service-worker';

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import {HomeDashboardService} from 'src/app/pages/home-dashboard/home-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as FormData from 'form-data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'Aureal - Podcast Rating Platform';
  playingEpisode;
  currentModule;
  isEmbedPlayer: Boolean = false;
  @ViewChild("sidenav", { static: false }) usuarioMenu: MatSidenav;

  constructor(public playerService: PlayerService, public router: Router, private update: SwUpdate, 
    private authService: SocialAuthService, private homeDashboardService : HomeDashboardService, private toastr: ToastrService) {

    this.currentModule = this.playerService.getCurrentModule();
    this.updateClient();
    // if(window.location.pathname.split('/')[1] == 'embed-player'){
    //   this.isEmbedPlayer = true;
    // }else{
    //   this.isEmbedPlayer = false;
    // }
    console.log(this.isEmbedPlayer);

  }
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      
      // this.user = user;
      // this.loggedIn = (user != null);
      if(user.idToken){
        let body = new FormData;
        body.append('identifier', user.idToken);
        body.append('loginType', 'google');
        this.homeDashboardService.userAuth(body).subscribe((res:any) => {
          localStorage.setItem('userId',res.userData.id);
          localStorage.setItem('userName',res.userData.username);
          localStorage.setItem('token',res.userData.token);
          if(res.userData.hiveAccessToken){
            localStorage.setItem('access_token',res.userData.hiveAccessToken);
          }
          if(res.userData.hive_username){
            localStorage.setItem('hive_username',res.userData.hive_username);
          }
          location.reload();
          this.router.navigateByUrl('/');
        })
      }else{
        this.toastr.error('Something went wrong');
      }
    });
    this.currentModule.subscribe( current =>{
      console.log(current);
      if(current){
        if(this.playingEpisode && current.id != this.playingEpisode.id){
          this.playingEpisode = current;
        }else{
          this.playingEpisode = current;
        }
        console.log('wertyuiop',this.playingEpisode);
  
      }
    });  
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available `, event.available);
      if (confirm('Update available ! Please click on Ok to update.')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available `, event.current);
    });
  }

  check(){
    // document.body.onkeyup = function(e){
    //   console.log(e);
    // }
  }

  navigateHome(){
    this.router.navigateByUrl('/');
  }

  closeAllSidenav() {
    this.usuarioMenu.close();
  }




}
