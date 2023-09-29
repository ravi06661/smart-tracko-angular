import { StudentDetails } from "./student-details"
import { TaskQuestion } from "./task-question"

export class AssignmentSubmission {

    public submissionId:number = 0
    public assignmentId:number = 0
    public taskId:number = 0
    public student:StudentDetails = new StudentDetails
    public description:string = ''
    public submitFile:string = ''
    public submissionDate!: Date 
    public status:string = ''
    public review:string = ''
    public taskQuestion:TaskQuestion= new TaskQuestion
    public title:string=''

}
