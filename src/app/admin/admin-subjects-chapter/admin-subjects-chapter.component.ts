import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { Chapter } from 'src/app/entity/chapter';
import { QuizeQuestion } from 'src/app/entity/quize-question';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { ChapterResponse } from 'src/app/payload/chapter-response';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { AppUtils } from 'src/app/utils/app-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { QuestionResponse } from 'src/app/payload/question-response';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-admin-subjects-chapter',
  templateUrl: './admin-subjects-chapter.component.html',
  styleUrls: ['./admin-subjects-chapter.component.scss']
})
export class AdminSubjectsChapterComponent {
  chapter: Chapter[] = []
  subjects: Subject[] = [];
  subjectId: number = 0;
  chapterName: string = ''
  message: string = '';
  chapterId = 0;
  chapterUpdate: ChapterResponse = new ChapterResponse()
  id: number = 0;
  questionId: number = 0;

  imageName = ''
  techImages: TechnologyStack[] = [];
  chapterIndex: number = 0;
  chapterResponse: ChapterResponse[] = []
  question: QuizeQuestion = new QuizeQuestion();
  submissionForm: FormGroup
  questions: QuizeQuestion[] = []
  questionIndex!: number;
  public Editor = ClassicEditor;
  image: File | null = null;
  private editorInstance: any;

  constructor(private subjectService: SubjectService,
    private route: ActivatedRoute,
    private chapterService: ChapterServiceService,
    private techService: TechnologyStackService,
    private router: Router,
    private toast: ToastService, private formBuilder: FormBuilder, private questionService: QuestionServiceService) {

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
    this.subjectId = this.route.snapshot.params[('id')];
    this.getSubjectById(this.subjectId)
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });

    this.getAllSubjectQuestion();
  }

  public getSubjectById(subjectId: number) {
    this.subjectService.getAllChapterWithSubjectId(subjectId).subscribe({
      next: (data: any) => {
        this.chapterResponse = data.chapters
      }
    })
  }

  public addChapter() {
    if (this.chapterUpdate.chapterName.trim() == '') {
      this.message = "please enter subject name.."
      return;
    } else {
      this.chapterService.addChapter(this.subjectId, this.chapterUpdate.chapterName.trim()).subscribe(
        {
          next: (data: any) => {
            this.chapterUpdate = new ChapterResponse();
            this.chapterResponse.push(data.chapter)
            AppUtils.modelDismiss('chapter-save-modal')
            this.message = ''
            this.toast.showSuccess('Chapter added successfully!!', 'Success')
          },
          error: (error) => {
            this.toast.showError(error.error.message, 'Error')
          }
        }
      )
    }
  }
  public deleteChapter() {
    this.chapterService.deleteChapter(this.chapterId).subscribe(
      {
        next: (data: any) => {
          this.chapterResponse.splice(this.chapterIndex, 1)
          this.chapterId = 0;
          this.chapterIndex = 0
          this.toast.showSuccess('chapter deleted successfully!!', 'Success')
        },
        error: (error) => {
          this.toast.showError(error.error.message, 'Error')
        }
      }
    )
  }
  public cancel() {
    this.chapterUpdate = new ChapterResponse();
  }
  public reload() {
    this.message = ''
    this.chapterUpdate = new ChapterResponse();
  }

  public updateChapter() {
    this.chapterService.updateChapter(this.chapterId, this.chapterUpdate.chapterName).subscribe(
      {
        next: (data) => {
          let ch = this.chapterResponse.find(obj => obj.chapterId === this.chapterId) as ChapterResponse
          ch.chapterName = this.chapterUpdate.chapterName;
          this.chapterId = this.chapterId;
          ch.chapterId = this.chapterUpdate.chapterId

          AppUtils.modelDismiss('chapter-update-modal')
          this.toast.showSuccess('Chapter updated successfully!!', 'success')
        },
        error: (error) => {
          this.toast.showError(error.error.message, 'Error')
        }
      }
    )
  }
  public getChapterById(id: number) {
    this.chapterId = id;
    this.chapterUpdate = this.chapterResponse.find(obj => obj.chapterId == id) as ChapterResponse
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

  public getAllSubjectQuestion() {
    this.subjectService.getAllSubjectQuestion(this.subjectId).subscribe(
      {
        next: (data: any) => {
          this.questions = data;
        },
        error: (er: any) => {
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
          this.questions[this.questionIndex] = data.question
          this.cancel()
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

  public setQuestion(id: number, index: number) {
    this.questionIndex = index
    this.question = { ...this.questions.find(obj => obj.questionId === id) as QuestionResponse }
  }

  handleImageInput(event: any) {
    this.question.questionImage = event.target.files[0];
  }

  public addQuestion() {
    if (this.submissionForm.invalid) {
      this.submissionFormFun()
    } else {
      this.questionService.addQuestionToSubjectExam(this.question, this.subjectId).subscribe(
        {
          next: (data) => {
            this.questions.push(data)
            this.question = new QuizeQuestion();
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

  public addExam(type:string){
     this.subjectService.addSubjectExam(type).subscribe({
      next:(data:any)=>{
       console.log(data.subjectExam);
       
      },
      error:(er:any)=>{
        this.toast.showError(er.error.message,'Error')
      }
     })
  }

}