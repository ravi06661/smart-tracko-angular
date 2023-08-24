
import { Course } from "../entity/course";
import { Subject } from "../entity/subject";

export class TaskRequest {
    public course: Course = new Course()
    public subject: Subject = new Subject();
    public attachmentStatus:string=''
    public taskName:string=''

}
