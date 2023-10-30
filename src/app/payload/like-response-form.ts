import { LikeResponse } from "./like-response";

export class LikeResponseForm {
    public type: string = '';
    public discussionFormId:number=0;
    public likes:LikeResponse[]=[]

    public constructor (discussionFormId: number, type: string,likes:LikeResponse[]) {
      this.type = type
      this.discussionFormId = discussionFormId
      this.likes=likes
  }
}
