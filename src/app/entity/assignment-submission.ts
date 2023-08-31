import { StudentDetails } from "./student-details"

export class AssignmentSubmission {

    public submissionId:number = 0
    public assignmentId:number = 0
    public taskId:number = 0
    public student:StudentDetails = new StudentDetails
    public description:string = ''
    public submitFile:string = ''
    public submissionDate:any
    public status:string = ''
    public review:string = ''

}
