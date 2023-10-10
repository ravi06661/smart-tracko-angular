import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { LoginService } from 'src/app/service/login.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-subjectdetails',
  templateUrl: './subjectdetails.component.html',
  styleUrls: ['./subjectdetails.component.scss']
})
export class SubjectdetailsComponent {
  chapterId: number = 0;
  chapter: ChapterContent[] = []
  subjectId: number = 0;
  chapterContent: ChapterContent = new ChapterContent();
  chapterName: string = '';
  questionsInChapter = 0;
  isCompleted = false;
  resultId = 0;

  constructor(private activateRouter: ActivatedRoute,
    private subjectService: SubjectService,
    private chapterService: ChapterServiceService,
    private examService: ExamServiceService,
    private loginService: LoginService,
    private acitvateRoute: ActivatedRoute) { }
  ngOnInit() {
    this.acitvateRoute.queryParams.subscribe(params => {
      this.chapterId = params['chapterId'];
      this.subjectId = params['subjectId'];
    });
    this.getChapter();
    this.getChapterExamIsComplete();
  }
  public getChapter() {
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
    this.chapterService.getChapterContent(this.chapterId).subscribe(
      (data) => {
        this.chapterContent = data;
      }
    )
  }
  public getChapterExamIsComplete() {
    this.examService.getChapterExamIsCompleted(this.chapterId, this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        if (data != null) {
          this.chapterId = data.chapterExamComplete.chapterId;
          this.isCompleted = true;
          this.resultId = data.resultId;
        }
      },
      error: (err) => {
      }
    })
  }

}
