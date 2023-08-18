import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { relativeTimeThreshold } from 'moment';
import { Chapter } from 'src/app/entity/chapter';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { Subject } from 'src/app/entity/subject';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-admin-subjects-topic-test',
  templateUrl: './admin-subjects-topic-test.component.html',
  styleUrls: ['./admin-subjects-topic-test.component.scss']
})
export class AdminSubjectsTopicTestComponent {
  questionId: number = 0;
  chapter: ChapterContent[] = []
  chapterId: number = 0;
  subjectId: number = 0;
  chapterContent: ChapterContent = new ChapterContent();
  erroreMessage: string = ''
  deleteContentId = 0;
  constructor(private chapterService: ChapterServiceService, private route: ActivatedRoute, private questionService: QuestionServiceService) { }
  ngOnInit() {
    this.getChapter();
  }
  public getChapter() {
    this.chapterId = this.route.snapshot.params[('id')];
    this.chapterService.getChapterById(this.chapterId).subscribe(
      (data: any) => {
        this.chapter = data.chapterContent;
        this.subjectId = data.subject.subjectId;
      }
    )
  }
  //add chapter content
  public submit() {
    this.chapterService.addChapterContent(this.chapterContent, this.chapterId).subscribe(
      (data) => {
        this.erroreMessage = 'Success'
        this.chapterContent = new ChapterContent();
        this.getChapter();
      },
      (error) => {
        this.erroreMessage = "error occure please submit again.."
      }
    )
  }
  public clearForm() {
    this.erroreMessage = ''
    this.chapterContent = new ChapterContent();
  }

  public updateContent() {
    this.chapterService.updateChapterContent(this.chapterId, this.chapterContent).subscribe(
      (data) => {
        this.chapterContent = new ChapterContent;
        this.erroreMessage = " Success.."
      },
      (error) => {
        this.erroreMessage = "error occure please submit again.."
      }
    )
  }
  public cancelContent() {
    this.erroreMessage = ''
    this.chapterContent = new ChapterContent();
  }
  public getChapterContent(contentId: number) {
    this.chapterService.getChapterContent(this.chapterId, contentId).subscribe(
      (data) => {
        this.chapterContent = data;
         console.log(data);
      }
    )
  }
  public deleteContent() {
    this.chapterService.deleteContent(this.chapterId, this.deleteContentId).subscribe(
      (data) => {
        this.reload();
      }
    )
  }
  public clearContentDeleteId() {
    this.deleteContentId = 0;
  }

  public reload() {
    this.ngOnInit();
   this.chapterContent = new ChapterContent();
    this.erroreMessage=''
  }
}
