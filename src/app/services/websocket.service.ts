import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
export const WS_ENDPOINT = environment.SOCKET_ENDPOINT;

@Injectable()
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = []; //= this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
  private roomId;
  public connect(roomId): void {
    if (!this.socket$ || this.socket$.closed) {
      this.roomId = roomId;
      this.socket$ = this.getNewWebSocket();
      this.socket$.subscribe(    
        msg => {
          let message = JSON.parse(msg);
          if(message.roomid == this.roomId){
            this.messages$.push(JSON.parse(msg));
          }
          console.log('message received: ' + JSON.stringify(msg));
        }, 
        // Called whenever there is a message from the server    
        err => console.log(err), 
        // Called if WebSocket API signals some kind of error    
        () => console.log('complete') 
        // Called when connection is closed (for whatever reason)  
     );
      // const messages = this.socket$.pipe(
      //   tap({
      //     error: error => console.log(error),
      //   }), catchError(_ => EMPTY));
      // this.socket$.next(messages);
    }
  }
  
  private getNewWebSocket() {
    return webSocket(WS_ENDPOINT);
  }
  sendMessage(msg: any) {
    this.socket$.next(msg);
  }
  close() {
    this.socket$.complete(); }
}
