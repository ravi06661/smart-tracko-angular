import { ChapterContent } from "./chapter-content"
import { ChapterQuizeQuestion } from "./chapter-quize-question";
import { Question } from "./question";
export class Chapter {
    public chapterId:number =0;
    public chapterName: string =''
    public chapterScore: string =''
    public isDeleted: boolean | undefined
    public isActive: boolean | undefined
    public isCompleted: boolean | undefined
    public chapterContent:ChapterContent[]=[]
    public questions:ChapterQuizeQuestion[]=[]
}