import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {map} from "rxjs/operators";

import { Discussionformsocketresponse } from '../payload/discussionformsocketresponse';
import { WebsocketServiceDiscussionFormService } from './websocket-service-discussion-form-service.service';
@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  readonly URL = "ws://localhost:7070/ws";

  public messages!: Subject<Discussionformsocketresponse>;
  constructor(private websocketService:WebsocketServiceDiscussionFormService) { }   
  public connect() {
    console.log(this.messages);
    this.messages = <Subject<Discussionformsocketresponse>>(
      
      
      this.websocketService.connect(this.URL).pipe(map((response: MessageEvent): Discussionformsocketresponse => {
        let content = JSON.parse(response.data);
        console.log("res"+content);
        return {
        CommentResponse:content.CommentResponse,
        // LikeResponse:content.LikeResponse,
         type:content.type,
        // DiscussionFormResponse:content.discussionFormResponse
        };
      }))
    );
  }

  public disconnect() {
    this.websocketService.disconnect(this.URL);
  }
}
