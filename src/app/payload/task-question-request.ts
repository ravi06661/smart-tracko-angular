import { Assignment } from "../entity/assignment";

export class TaskQuestionRequest {
    public questionId:number=0;
    public question: string = ''
    public videoUrl: string = ''
    public questionImages:File[]=[]
}
//public questionImages = new Map<string,File>