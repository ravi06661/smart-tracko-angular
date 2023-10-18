import { ChapterQuizeQuestion } from "./chapter-quize-question"
import { Question } from "./question"

export class Exam {
    public examId: number | undefined
    public examName: number | undefined
    public score: number | undefined
    public isDeleted: boolean | undefined
    public isActive: boolean | undefined
    public questions:ChapterQuizeQuestion[]=[]
    public examTimer:number =0;
}
