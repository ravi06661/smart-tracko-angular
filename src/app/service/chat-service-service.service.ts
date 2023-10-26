import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { map } from "rxjs/operators"
import { WebsocketServiceDiscussionFormService } from './websocket-service-discussion-form-service.service';
@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  readonly QR_URL = `ws://localhost:8080/ws/sessionId?=`
  readonly DISCUSSION_URL = `ws://localhost:8080/ws/discussion`

  public messages!: Subject<any>; // DISCUSSIONFORUM
  public messages1!: Subject<any>;// FOR QR
  constructor(private websocketService: WebsocketServiceDiscussionFormService) { }
  public connectForDiscussionForm() {
    this.messages = <Subject<any>>(
      this.websocketService.connectForDiscussionForm(this.DISCUSSION_URL).pipe(map((response: MessageEvent): any => {

        let content = JSON.parse(response.data);
        if (content.type == 'commentResponse') {
          return {
            type: content.type,
            id: content.id,
            content: content.content,
            createdDate: content.createdDate,
            studentName: content.studentName,
            studentProfilePic: content.studentProfilePic,
            discussionFormId: content.discussionFormId
          };
        }
        if (content.type == 'likeResponse') {
          return {
            type: content.type,
            likes: content.likes,
            discussionFormId: content.discussionFormId
          };
        }
        if (content.type == 'createDiscussionForm') {
          return {
            type: content.type,
            content: content.content,
            createdDate: content.createdDate,
            studentName: content.studentName,
            studentProfilePic: content.studentProfilePic,
            file: content.file,
            id: content.id
          };
        }
      }))
    );
  }

  public connectForQr(key: any) {
    this.messages1 = <Subject<any>>(
      this.websocketService.connectForQr(this.QR_URL + key).pipe(map((response: MessageEvent): any => {
        let content = JSON.parse(response.data);
        return content;
      }))
    );
  }

  public disconnect() {
    this.websocketService.disconnect(this.QR_URL);
    this.websocketService.disconnect(this.DISCUSSION_URL);
  }
}
