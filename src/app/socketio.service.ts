import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { io } from "socket.io-client";
import { environment } from '../environments/environment';// '../../environments/environment';
export const WS_ENDPOINT = environment.SOCKET_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  private roomId;
  public messages$ = []; //= this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

  constructor() {

  }

  setupSocketConnection(roomId) {
    this.roomId = roomId;
    this.socket = io(environment.SOCKET_ENDPOINT, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    this.socket?.on('message', (data: any) => {
      console.log(data);
      let message = JSON.parse(data);
      if(message.roomid == this.roomId){
        this.messages$.push(JSON.parse(data));
      }
    });
  }

  sendMessage(msg: any) {
    this.socket.emit('message', msg);
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}
