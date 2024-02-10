import { QuizeQuestion } from "./quize-question"
import { Question } from "./question"

export class Exam {
    public examId: number | undefined
    public examName: number | undefined
    public score: number | undefined
    public isDeleted: boolean | undefined
    public isActive: boolean | undefined
    public questions:QuizeQuestion[]=[]
    public examTimer:number =0;
}
