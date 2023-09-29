import { Course } from "./course";
import { MessageSeenBy } from "./message-seen-by";

export class Announcement {

    public announcementId:number = 0;
    public title:string = '';
    public message:string = '';
    public course:Course[] = [];
    public seenBy:MessageSeenBy = new MessageSeenBy;
    public date:any;

}
