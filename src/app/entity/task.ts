import { Course } from "./course";
import { Subject } from "./subject";
import { TaskQuestion } from "./task-question";

export class Task {

    public taskId: number = 0;
    public taskName: string = ''
    public submitFile:string=''
    public attachmentStatus=''
    public isActive:boolean=false;
    public course:Course= new Course
    public subject:Subject = new Subject
    public taskQuestion:TaskQuestion[]=[]

} 
