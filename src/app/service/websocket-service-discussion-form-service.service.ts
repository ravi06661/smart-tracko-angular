
import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceDiscussionFormService {

  constructor() { }
  // private subject: Rj.Subject<MessageEvent> | undefined;
  // private subject1: Rj.Subject<MessageEvent> | undefined;

  // public connectForDiscussionForm(url: string): Rj.Subject<MessageEvent> {
  //   if (!this.subject) {
  //     this.subject = this.create(url);
  //     console.log('Successfully connected to: ' + url);
  //   }
  //   return this.subject;
  // }


  // // public connectForQr(url: string): Rj.Subject<MessageEvent> {
  // //   if (!this.subject1) {
  // //     this.subject1 = this.create(url);
  // //     console.log('Successfully connected to:  ' + url);
  // //   }
  // //   return this.subject1;
  // // }

  // public disconnect(url: string) {
  //   this.subject = undefined;
  //   this.subject1  = undefined
  //   console.log('Successfully disconnected from: ' + url);
  // }

  // private create(url: string): Rj.Subject<MessageEvent> {
  //   let wsc = new WebSocket(url);
  //   console.log("sesssionid---> ", wsc);

  //   let observable = Rj.Observable.create((obs: Rj.Observer<MessageEvent>) => {
  //     wsc.onmessage = obs.next.bind(obs);
  //     wsc.onerror = obs.error.bind(obs);
  //     wsc.onclose = obs.complete.bind(obs);
  //     return wsc.close.bind(wsc);
  //   });
  //   let observer = {
  //     next: (data: Object) => {
  //       if (wsc.readyState === WebSocket.OPEN) {
  //         wsc.send(JSON.stringify(data));
  //       }
  //     },
  //   };
  //   return Rj.Subject.create(observer, observable);
  // }
  // private stompClient!: Stomp.Client;
  // private messagesSubject: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject<any>(null);

  // connect() {
  //   const socket = new SockJS('http://localhost:8080/socket');
  //   this.stompClient = Stomp.over(socket);

  //   this.stompClient.connect({}, (frame: any) => {
  //     console.log('WebSocket connected');
  //     this.stompClient.subscribe('/topic/discussion', (message: any) => {
  //       const parsedMessage = JSON.parse(message.body);
  //       this.messagesSubject.next(parsedMessage);
  //       console.log("Received message:", parsedMessage);
  //     });
  //   });
  // }

  // disconnect(callback?: () => void) {
  //   if (this.stompClient) {
  //     this.stompClient.disconnect(() => {
  //       console.log('WebSocket disconnected');
  //       if (callback) {
  //         callback();
  //       }
  //     });
  //   }
  // }

  // sendMessage(message: any) {
  //   this.stompClient.send('/app/discussion', {}, JSON.stringify(message));
  // }

  // getMessages(): Rx.Observable<any> {
  //   return this.messagesSubject.asObservable();
  // }
}
