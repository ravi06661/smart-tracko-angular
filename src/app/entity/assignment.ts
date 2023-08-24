import { AssignmentImage } from "./assignment-image"
import { Course } from "./course";
import { Subject } from "./subject";
import { TaskQuestion } from "./task-question"

export class Assignment {
   public  title:string = '';
   public  taskAttachment:string = '';
   public  assignmentQuestion:TaskQuestion[] = [];
   public  course:Course = new Course;
   public  subject:Subject = new Subject ;
   public  isActive:boolean = true;
   public  createdDate:Date | undefined;
}
