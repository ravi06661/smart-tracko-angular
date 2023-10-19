import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  constructor() { }
  public readonly url = 'http://localhost:7070/chat';
  public readonly topicMessage = '/secured/topic/messages';
  public readonly topicChat = '/secured/app/chat';
}
