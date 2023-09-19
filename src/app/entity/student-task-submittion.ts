import { StudentDetails } from "./student-details"

export class StudentTaskSubmittion {
    public id:number = 0
    public taskDescription: string = ''
    public submittionFileName:string=''
    public student:StudentDetails = new StudentDetails
    public status:string = ''
    public review:string = ''
    public submissionDate:any
    public taskId : number = 0
    
}