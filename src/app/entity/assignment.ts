import { AssignmentImage } from "./assignment-image"

export class Assignment {
    public id: Number = 0
    public question: string = ''
    public assignmentImages:AssignmentImage[]=[]
    public hints: string[] = []
}
