import { StudentDetails } from "./student-details"

export class StudentTaskSubmittion {
    public id: number = 0
    public taskDescription: string = ''
    public submittionFileName: string = ''
    public status: string = ''
    public review: string = ''
    public submissionDate: any
    public taskId: number = 0
    public taskName: string = ''
    public studentProfilePic!: string
    public studentId!: number
    public fullName!:string
    public applyForCourse!:string
}