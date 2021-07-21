import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket
  ) {   }

  checkConnection() {
    this.socket.emit('host_joined', {id: 'loda'});
  }
}
