import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
  chapterName: string = ''
  
  public Editor = ClassicEditor;
  static images: File[] = []
  private editorInstance: any;

  constructor(private chapterService: ChapterServiceService, private route: ActivatedRoute, private questionService: QuestionServiceService) { }
  ngOnInit() {
    this.getChapter();
  }
  public getChapter() {
    this.chapterId = this.route.snapshot.params[('id')];
    this.chapterService.getChapterById(this.chapterId).subscribe(
      (data: any) => {
        this.chapter = data.chapter.chapterContent;
        this.chapterName = data.chapter.chapterName;
        this.subjectId = data.chapter.subject.subjectId;
      }
    )
  }
  //add chapter content
  public submit() {
    this.chapterService.addChapterContent(this.chapterContent, this.chapterId).subscribe(
      (data) => {
        this.erroreMessage = 'Success'
        this.chapterContent = new ChapterContent();
        this.editorInstance =''
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
        this.chapterId = 0;
      }
    )
  }
  public clearContentDeleteId() {
    this.deleteContentId = 0;
  }

  public reload() {
    this.ngOnInit();
    this.chapterContent = new ChapterContent();
    this.erroreMessage = ''
  }

  onEditorReady(eventData: any) {
    this.editorInstance = eventData;
  }
}
