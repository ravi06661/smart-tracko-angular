import { ChapterContent } from "./chapter-content"
export class Chapter {
    public chapterId:number | undefined
    public chapterName: string | undefined
    public chapterScore: string | undefined
    public isDeleted: boolean | undefined
    public isActive: boolean | undefined
    public isCompleted: boolean | undefined
    public chapterContent:ChapterContent[]=[]
}