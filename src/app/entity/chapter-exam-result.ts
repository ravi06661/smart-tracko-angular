import { Chapter } from "./chapter";
import { StudentDetails } from "./student-details";
export class ChapterExamResult {
  public id:number=0;
  public correcteQuestions:number=0;
  public  wrongQuestions:number=0;
  public notSelectedQuestions:number=0;
  public chapter= new Chapter;
  public student= new StudentDetails;
  public review= new Map<number, string>();
}