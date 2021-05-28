import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import {CommonService} from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public currentAudio;
  private currentModule: BehaviorSubject<object> = new BehaviorSubject<object>(null);
  constructor(
    private commonService : CommonService,
    public authService: AuthService) { }

  public setCurrentModule(data) {
    console.log('setCurrentModule', data);
    this.currentAudio = data;
    this.currentModule.next(data);
    if(data && this.authService.isAuthenticated())
      this.addListen(data);
  }

  addListen(episodeData) {
    let body = new FormData;
    body.append('episode_id', episodeData.id);
    body.append('user_id', localStorage.getItem('userId'));
    this.commonService.addListen(body).subscribe(res => {
      ;
    })
  }

  public getCurrentModule(): Observable<object> {
    return this.currentModule.asObservable();
  }
}
