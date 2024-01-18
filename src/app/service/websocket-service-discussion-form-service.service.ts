
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject, share } from 'rxjs';
import { UtilityServiceService } from './utility-service.service';
@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceDiscussionFormService {
  private stompClient: any;
  private messagesSubject: Subject<any> = new Subject<any>();
  private messagesObservable: Observable<any>;
  SOCKET_URL = this.utilityService.getBaseUrl() + "/socket"

  constructor(private utilityService: UtilityServiceService) {
    this.connect();
    this.messagesObservable = this.messagesSubject.asObservable().pipe(share());
  }

  public connect(): void {
    const socket = new SockJS(this.SOCKET_URL);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/queue/Chatmessages', (message: any) => {
        console.log(message.body);
        
        const parsedMessage = JSON.parse(message.body);
        //console.log = () => { };
        console.log(parsedMessage);
        
        this.messagesSubject.next(parsedMessage);
      });
    });
    // Reconnect logic
    socket.onclose = (event: CloseEvent) => {
      this.connect();
    };
  }


  public getMessages(): Observable<any> {
    return this.messagesObservable;
  }
  public sendMessage(message: any): void {
    console.log(message);
    
    this.stompClient.send('/api/socket', {}, JSON.stringify(message));
  }

}