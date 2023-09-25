import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-subjectdetails',
  templateUrl: './subjectdetails.component.html',
  styleUrls: ['./subjectdetails.component.scss']
})
export class SubjectdetailsComponent {
  chapterId:number=0;
  questionId: number = 0;
  chapter: ChapterContent[] = []
  subjectId: number = 0;
  chapterContent: ChapterContent = new ChapterContent();
  chapterName:string='';
  questionsInChapter = 0;

  constructor(private activateRouter:ActivatedRoute,private subjectService: SubjectService,private chapterService: ChapterServiceService){}
  ngOnInit(){
     this.chapterId=this.activateRouter.snapshot.params[('id')];
     this.getChapter();
  }
  public getChapter() {
    // this.chapterId = this.activateRouter.snapshot.params[('id')];
    this.chapterService.getChapterById(this.chapterId).subscribe(
      (data: any) => {
        this.chapter = data.chapter.chapterContent;
        this.chapterName = data.chapter.chapterName;
        this.subjectId = data.chapter.subject.subjectId;
        this.questionsInChapter = data.questionLength 
      }
    )
  }
  public getChapterContent(contentId: number) {
    this.chapterService.getChapterContent(this.chapterId, contentId).subscribe(
      (data) => {
        this.chapterContent = data;
        console.log(data);
      }
    )
  }
}
