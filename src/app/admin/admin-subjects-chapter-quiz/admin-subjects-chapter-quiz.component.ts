import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { Question } from 'src/app/entity/question';
import { QuestionResponse } from 'src/app/payload/question-response';
import { timeStamp } from 'console';
import { AppUtils } from 'src/app/utils/app-utils';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/service/toast.service';
@Component({
  selector: 'app-admin-subjects-chapter-quiz',
  templateUrl: './admin-subjects-chapter-quiz.component.html',
  styleUrls: ['./admin-subjects-chapter-quiz.component.scss']
})
export class AdminSubjectsChapterQuizComponent {

  questionId: number = 0;
  questions: ChapterQuizeQuestion[] = []
  id: number = 0;
  question: ChapterQuizeQuestion = new ChapterQuizeQuestion();
  public Editor = ClassicEditor;
  image: File | null = null;
  private editorInstance: any;
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  submissionForm: FormGroup
  subjectId: number = 0;
  questionIndex = 0

  constructor(private activateRouter: ActivatedRoute,
    private questionService: QuestionServiceService,
    private route: ActivatedRoute, private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder,
    private chapterService: ChapterServiceService,
    private toast: ToastService) {

    this.submissionForm = this.formBuilder.group({
      correctOption: ['', Validators.required],
      option4: ['', Validators.required],
      option3: ['', Validators.required],
      option2: ['', Validators.required],
      option1: ['', Validators.required],
      questionContent: ['', Validators.required]
    });
  }
  ngOnInit() {
    //this.id = this.route.snapshot.params[('id')];
    this.activateRouter.queryParams.subscribe(params => {
      this.id = params['chapterId'];
      this.subjectId = params['subjectId'];
    });
    this.getAllQuestions();
  }
  public addQuestion() {
    if (this.submissionForm.invalid) {
      this.submissionFormFun()
    } else {
      this.questionService.addQuestion(this.question, this.id).subscribe(
        {
          next: (data) => {
            this.questions.push(data)
            this.question = new ChapterQuizeQuestion();
            AppUtils.modelDismiss('quize-save-modal')
            this.toast.showSuccess('Quize successfully added!!', 'Success')
          },
          error: (er) => {
            this.toast.showError('Error please try again!!', 'Error')
          }
        }
      )
    }
  }
  handleImageInput(event: any) {
    this.question.questionImage = event.target.files[0];
  }

  public getAllQuestions() {
    this.chapterService.getChapterExamQuestions(this.id).subscribe(
      {
        next: (data: any) => {
          this.questions = data.questions;
        },
        error: (er) => {

        }
      }
    )
  }
  public deleteQuestion() {
    this.questionService.deleteQuestionById(this.questionId).subscribe(
      {
        next: (data) => {
          this.questionId = 0;
          this.questions.splice(this.questionIndex, 1);
          AppUtils.modelDismiss('delete-quize-modal')
          this.toast.showSuccess('Successfully deleted', 'Sucsess')
        },
        error: (error) => {
          this.toast.showError('Error', 'Error')
        }
      }
    )
  }

  public updateQuestion() {
    this.questionService.updateQuestionById(this.question).subscribe(
      {
        next: (data: any) => {
          AppUtils.modelDismiss('update-quize-modal')
          //   this.question = new ChapterQuizeQuestion();
          // let qr = this.questions.findIndex(obj => obj.questionId === data.questionId)
          this.questions[this.questionIndex] = data.question
          //  this.getAllQuestions();
        
          this.toast.showSuccess(data.message, 'Success')
        },
        error: (error) => {
          this.toast.showError(error.error.message, 'Error')
        }
      }
    )
  }

  public getQuestionById(id: number) {
    this.questionService.getQuestionById(id).subscribe(
      (data) => {
        this.question = data;
      }
    )
  }
  public cancel() {
    this.question = new ChapterQuizeQuestion();
  }
  public clearFormSubmission() {
   this.submissionForm.reset()
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

  public pageRenderUsingRouterLink(path: string) {
    const dataParams = {
      subjectId: this.subjectId,
      chapterId: this.id,
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

  public setQuestion(id: number, index: number) {
    this.questionIndex = index
    this.question = {...this.questions.find(obj => obj.questionId === id) as QuestionResponse}
  }
}
