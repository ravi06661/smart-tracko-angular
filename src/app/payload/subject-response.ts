import { TechnologyStack } from "../entity/technology-stack";

export class SubjectResponse {

    public subjectId: number = 0;
    public subjectName: string = '';
    public chapters: [] = [];
    public technologyStack: TechnologyStack = new TechnologyStack;
    public isDeleted: boolean = false;
    public isActive: boolean = true;
    public chapterCount: number =0;
    public chapterCompleted:number=0;
}
