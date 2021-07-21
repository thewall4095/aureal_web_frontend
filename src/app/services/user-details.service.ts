import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  apiUrl: string = environment.apiUrl;
  public UserDetails;

  constructor(private api: ApiService) { }

  getUserDetails(id) {
    return this.api.get(this.apiUrl + '/private/users?user_id=' + id).toPromise();
  }


  updateUser(body) {
    return this.api.post(this.apiUrl + '/private/updateUser', body).toPromise();
  }


  uploadImage(body) {
    return this.api.post(this.apiUrl + '/private/getImageUrl', body).toPromise();
  }


  // getUserHiveDetails() {
  //   return this.api.get(this.apiUrl + '/public/getHiveAccountDetails?hiveusername='+localStorage.getItem('hive_username')).toPromise();
  // }

  getUserNotifications(){
    return this.api.get(this.apiUrl + '/public/getNotifications?user_id='+localStorage.getItem('userId')).toPromise();
  }

  claimRewards(body) {
    return this.api.post(this.apiUrl + '/private/claimRewards', body).toPromise();
  }

  getCategories(){
    return this.api.get(this.apiUrl + '/public/getCategory?user_id='+localStorage.getItem('userId')).toPromise();
  }

  updateUserCategory(body) {
    return this.api.post(this.apiUrl + '/private/addUserCategory', body).toPromise();
  }

  updateUserLanguage(body) {
    return this.api.post(this.apiUrl + '/private/addUserLanguage', body).toPromise();
  }

  getLanguages(){
    return this.api.get(this.apiUrl + '/public/getLanguage?user_id='+localStorage.getItem('userId')).toPromise();
  }

  getPersonalReferralLink(){
    return this.api.get(this.apiUrl + '/public/getPersonalReferralLink?user_id='+localStorage.getItem('userId')).toPromise();
  }

  getUsedReferralInfo(){
    return this.api.get(this.apiUrl + '/public/getUsedReferralInfo?user_id='+localStorage.getItem('userId')).toPromise();
  }

  validateReferral(body){
    return this.api.post(this.apiUrl + '/public/validateReferral', body).toPromise();
  }

}
