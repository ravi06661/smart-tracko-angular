import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MyUploadAdapter } from 'src/app/entity/my-upload-adapter';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  message: string = ''
  private editorInstance: any;
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  submissionForm: FormGroup

  constructor(private questionService: QuestionServiceService, private route: ActivatedRoute, private router: Router, private utilityService: UtilityServiceService, private formBuilder: FormBuilder) {
    this.submissionForm = this.formBuilder.group({
      correctOption: ['', Validators.required],
      option4: ['', Validators.required],
      option3: ['', Validators.required],
      option2: ['', Validators.required],
      option1: ['', Validators.required],
      questionContent: ['', Validators.required],
      file: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.id = this.route.snapshot.params[('id')];
    this.getAllQuestions();
  }
  public addQuestion() {
    if (this.submissionForm.invalid) {
      this.submissionFormFun()
    } else {
      this.questionService.addQuestion(this.question, this.id).subscribe(
        (data) => {
          this.question = new ChapterQuizeQuestion();
          this.message = 'success..';
        }
      )
    }
  }
  handleImageInput(event: any) {
    this.question.questionImage = event.target.files[0];
  }

  public getAllQuestions() {
    if (this.id) {
      this.questionService.getAllQuestionByChapterId(this.id).subscribe(
        (data) => {
          this.questions = data;
        }
      )
    }
  }
  public deleteQuestion() {
    this.questionService.deleteQuestionById(this.questionId).subscribe(
      (data) => {
      }, (error) => {
        this.questionId = 0;
        this.getAllQuestions();
      }
    )
  }

  public updateQuestion() {
    this.questionService.updateQuestionById(this.question, this.id).subscribe(
      (data) => {

        this.message = 'success..';
        this.question = new ChapterQuizeQuestion();
        this.getAllQuestions();
      }, (error) => {
        this.message = 'error..';
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
  reload() {
    this.question = new ChapterQuizeQuestion();
    this.getAllQuestions();
    this.message = ''
  }

  public setChapterTestTimer() {

  }
  public clearFormSubmission() {
    this.submissionForm = this.formBuilder.group({
      correctOption: ['', Validators.required],
      option4: ['', Validators.required],
      option3: ['', Validators.required],
      option2: ['', Validators.required],
      option1: ['', Validators.required],
      questionContent: ['', Validators.required],
      file: ['', Validators.required]
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
}
