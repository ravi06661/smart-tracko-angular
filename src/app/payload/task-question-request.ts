export class TaskQuestionRequest {
    public question: string = ''
    public videoUrl: string = ''
    public questionImages:File[]=[]
}
//public questionImages = new Map<string,File>