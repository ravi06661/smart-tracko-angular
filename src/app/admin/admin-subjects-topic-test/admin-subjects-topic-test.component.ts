import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chapter } from 'src/app/entity/chapter';
import { ChapterContentResponse } from 'src/app/payload/chapter-content-response';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app-utils';
import { ToastService } from 'src/app/service/toast.service';
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
  contentIndex = 0;
  constructor(private router: Router,
    private chapterService: ChapterServiceService,
    private route: ActivatedRoute,
    private questionService: QuestionServiceService,
    private formBuilder: FormBuilder,
    private activateRouter: ActivatedRoute,
    private toast: ToastService) {

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
          if (data.chapterName) {
            this.chapterName = data.chapterName
          } else {
            this.chapterName = this.chapteContentResponse[0].chapterName
          }
        },
        error: (er) => {
          this.toast.showError(er.error.message, 'Error')
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
          next: (data: any) => {
            this.chapterContent = new ChapterContent();
            this.chapteContentResponse.push(data.chapterContent)
            this.editorInstance = ''
            AppUtils.modelDismiss('add-content-modal')
            this.toast.showSuccess('Successfully added', 'Success')
          },
          error: (error) => {
            this.toast.showError('please try again!!', 'Error')
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
          AppUtils.modelDismiss('content-update-modal')
          this.toast.showSuccess('Successfully updated ', 'Success')
          this.chapterContent = data
        },
        error: (error) => {
          this.toast.showError(error.error.message, 'Error')
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
          this.chapteContentResponse.splice(this.contentIndex, 1);
          this.deleteContentId = 0;
          this.contentIndex = 0
          AppUtils.modelDismiss('content-delete-modal')
          this.toast.showSuccess('Successfully deleted ', 'Success')

        },
        error: (er) => {
          this.toast.showError('error', 'Error')
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
