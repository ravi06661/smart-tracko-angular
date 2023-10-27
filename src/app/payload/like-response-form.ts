import { LikeResponse } from "./like-response";

export class LikeResponseForm {
    public type: string = '';
  //  public id: number = 0;
   // public createdDate: Date | undefined;
   // public content: string = '';
   // public studentName: string = '';
  // public studentProfilePic: string = '';
    public discussionFormId:number=0;
    public likes:LikeResponse[]=[]
}
