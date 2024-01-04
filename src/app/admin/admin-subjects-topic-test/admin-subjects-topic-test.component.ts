import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chapter } from 'src/app/entity/chapter';
import { ChapterContentResponse } from 'src/app/payload/chapter-content-response';
@Component({
  selector: 'app-admin-subjects-topic-test',
  templateUrl: './admin-subjects-topic-test.component.html',
  styleUrls: ['./admin-subjects-topic-test.component.scss']
})
export class AdminSubjectsTopicTestComponent {

  questionId: number = 0;
  //chapterContentList: ChapterContent[] = []
  chapterId: number = 0;
  subjectId: number = 0;
  chapterContent: ChapterContent = new ChapterContent();
  erroreMessage: string = ''
  deleteContentId = 0;
  chapterName: string = ''
  //chapter: Chapter = new Chapter
  public Editor = ClassicEditor;
  static images: File[] = []
  private editorInstance: any;
  submissionForm: FormGroup
  chapteContentResponse: ChapterContentResponse[] = []
  // chapterContent:ChapterContentResponse = new  ChapterContentResponse
  constructor(private router: Router, private chapterService: ChapterServiceService, private route: ActivatedRoute, private questionService: QuestionServiceService, private formBuilder: FormBuilder, private activateRouter: ActivatedRoute) {
    this.submissionForm = this.formBuilder.group({
      content: ['', Validators.required],
      subTitle: ['', Validators.required],
      title: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.activateRouter.queryParams.subscribe(params => {
      this.chapterId = params['chapterId'];
      this.subjectId = params['subjectId'];
    });
    this.getChapter();
  }

  public getChapter() {
    this.erroreMessage = ''
    this.chapterService.getChapterContentWithChapterIdForAdmin(this.chapterId).subscribe(
      {
        next: (data: any) => {
          this.chapteContentResponse = data.chapterContent
          if(data.chapterName){
            this.chapterName = data.chapterName
          }else{
            this.chapterName = this.chapteContentResponse[0].chapterName
          }
        },
        error: (er) => {
          this.erroreMessage = er.error.message
        }
      }
    )
  }
  //add chapter content
  public submit() {
    if (this.submissionForm.invalid) {
      this.submissionFormFun()
      return;
    } else {
      this.chapterService.addChapterContent(this.chapterContent, this.chapterId).subscribe(
        {
          next: (data:any) => {
            this.erroreMessage = 'Success'
            this.chapterContent = new ChapterContent();
            this.chapteContentResponse.push(data.chapterContent)
            this.editorInstance = ''
          },
          error: (error) => {
            this.erroreMessage = "error occure please submit again.."
          }
        }
      )
    }
  }

  public clearForm() {
    this.erroreMessage = ''
    this.chapterContent = new ChapterContent();
  }

  public updateContent() {
    this.chapterService.updateChapterContent(this.chapterContent).subscribe(
      {
        next: (data: any) => {
          this.erroreMessage = " Success.."
          this.chapterContent = data
        },
        error: (error) => {
          this.erroreMessage = error.error.message
        }
      }
    )
  }
  public cancelContent() {
    this.erroreMessage = ''
    this.chapterContent = new ChapterContent();
  }
  public getChapterContent(contentId: number) {
    this.chapterContent = this.chapteContentResponse.find(obj => obj.id === contentId) as ChapterContent
  }

  public deleteContent() {
    this.chapterService.deleteContent(this.deleteContentId).subscribe(
      {
        next: (data) => {
          let index = this.chapteContentResponse.findIndex(obj => obj.id === this.deleteContentId)
          this.chapteContentResponse.splice(index, 1);
          this.deleteContentId = 0;
        },
        error: (er) => {
        }
      }
    )
  }

  public clearContentDeleteId() {
    this.deleteContentId = 0;
  }

  public reload() {
    //this.getChapter()
    this.chapterContent = new ChapterContent();
    this.erroreMessage = ''
  }

  onEditorReady(eventData: any) {
    this.editorInstance = eventData;
  }

  public clearFormSubmission() {
    this.submissionForm = this.formBuilder.group({
      content: ['', Validators.required],
      subTitle: ['', Validators.required],
      title: ['', Validators.required]

    });
  }
  public isFieldInvalidForSubmissionForm(fieldName: string): boolean {
    const field = this.submissionForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
  public submissionFormFun() {
    Object.keys(this.submissionForm.controls).forEach(key => {
      const control = this.submissionForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public pageRenderUsingRouterLink(path: string, chapterId: number) {
    const dataParams = {
      subjectId: this.subjectId,
      chapterId: chapterId,
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }
}
