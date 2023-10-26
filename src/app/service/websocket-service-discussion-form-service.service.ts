import { Injectable } from '@angular/core';
import { uniqueDates } from 'igniteui-angular/lib/core/utils';
import * as Rj from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceDiscussionFormService {

  constructor() { }

  private subject: Rj.Subject<MessageEvent> | undefined;
  private subject1: Rj.Subject<MessageEvent> | undefined;
  
  public connectForDiscussionForm(url: string): Rj.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected to: ' + url);
    }
    return this.subject;
  }


  public connectForQr(url: string): Rj.Subject<MessageEvent> {
    if (!this.subject1) {
      this.subject1 = this.create(url);
      console.log('Successfully connected to:  ' + url);
    }
    return this.subject1;
  }

  public disconnect(url: string) {
    this.subject = undefined;
    this.subject1  = undefined
    console.log('Successfully disconnected from: ' + url);
  }

  private create(url: string): Rj.Subject<MessageEvent> {
    let wsc = new WebSocket(url);
    console.log("sesssionid---> ", wsc);
   
    let observable = Rj.Observable.create((obs: Rj.Observer<MessageEvent>) => {
      wsc.onmessage = obs.next.bind(obs);
      wsc.onerror = obs.error.bind(obs);
      wsc.onclose = obs.complete.bind(obs);
      return wsc.close.bind(wsc);
    });
    let observer = {
      next: (data: Object) => {
        if (wsc.readyState === WebSocket.OPEN) {
          wsc.send(JSON.stringify(data));
        }
      },
    };
    return Rj.Subject.create(observer, observable);
  }
}
