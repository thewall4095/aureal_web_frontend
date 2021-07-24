import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  apiUrl: string = environment.apiUrl;

  constructor(private api: ApiService) { }

  createRoom(body) {
    return this.api.post(this.apiUrl + '/public/addNewRoom', body);
  }

  getRoomDetails(body) {
    return this.api.post(this.apiUrl + '/public/getRoomDetails', body);
  }

  hostJoined(body) {
    return this.api.post(this.apiUrl + '/private/hostJoined', body);
  }

  getUserRooms(userId) {
    return this.api.get(this.apiUrl + '/public/getUserRooms?userid='+userId);
  }

  deleteRoom(body) {
    return this.api.post(this.apiUrl + '/private/deleteRoom', body);
  }
}
