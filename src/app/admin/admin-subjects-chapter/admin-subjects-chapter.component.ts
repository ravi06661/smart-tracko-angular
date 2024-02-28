import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error, log } from 'console';
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
import { AppUtils } from 'src/app/utils/app-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { QuestionResponse } from 'src/app/payload/question-response';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Exam } from 'src/app/entity/exam';

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
  subjectExamId!: number
  chapterUpdate: ChapterResponse = new ChapterResponse()
  id: number = 0;
  questionId: number = 0;

  imageName = ''
  techImages: TechnologyStack[] = [];
  chapterIndex: number = 0;
  chapterResponse: ChapterResponse[] = []
  image: File | null = null;
  examForm!: FormGroup
  exam = new Exam()
  scheduleExam: Exam[] = []
  normlaExam: Exam[] = []
  updateExam = new Exam();
  submissionForm!: FormGroup
  totalChapterExamQuestion: any;

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
    this.initiaLiseExamform()
  }

  initiaLiseExamform() {
    this.examForm = this.formBuilder.group({
      totalQuestionForTest: ['', Validators.required, Validators.min(1), Validators.max(this.questions.length + this.totalChapterExamQuestion)],
      examTimer: ['', Validators.required],
      examName: ['', Validators.nullValidator],
      passingMarks: ['', Validators.required],
    })

  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params[('id')];
    this.getSubjectChapters(this.subjectId)
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });

    this.getAllExams();
    this.getAllSubjectQuestion()
  }
  public isFieldInvalidForExamForm(fieldName: string): boolean {
    const field = this.examForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
  public ExamsubmissionFormFun() {
    Object.keys(this.examForm.controls).forEach(key => {
      const control = this.examForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }



  public getSubjectChapters(subjectId: number) {
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

  public clearExamForm() {

  }

  examId!: number
  public pageRenderUsingRouterLink(path: string, chapterId?: number) {
    const dataParams = {
      subjectId: this.subjectId,
      chapterId: chapterId,
      type: "subjectExamQuestion",
      examId: this.examId
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

  public pageRenderToSujbectExamResult(examId: number) {
    let params = {
      subjectExamId: examId,
      type: "subjectExam"
    }
    this.router.navigate(['/admin/result/'], {
      queryParams: params
    })
  }


  public addExam() {

    // if (this.examForm.invalid) {
    //   this.ExamsubmissionFormFun()
    //   return;

    // } else {
    this.exam.subjectId = this.subjectId
    this.subjectService.addSubjectExam(this.exam).subscribe({
      next: (data: any) => {
        AppUtils.modelDismiss('close-exam-add-form')
        this.toast.showSuccess(data.message, 'Success')
        if (data.subjectExam.examType == "NORMALEXAM")
          this.normlaExam.push(data.subjectExam)
        else if (data.subjectExam.examType == "SCHEDULEEXAM")
          this.scheduleExam.push(data.subjectExam)
        this.exam = new Exam()
        this.examForm.reset()
        this.initiaLiseExamform()
      },
      error: (er: any) => {
        this.toast.showError(er.error.message, 'Error')
      }
    })
    //    }
  }
  examType!: string
  setExamType(type: string) {
    this.examType = type
  }
  index!: number
  deleteExam() {
    this.subjectService.deleteSubjectExam(this.examId).subscribe({
      next: (data: any) => {
        if (this.examType == "NORMALEXAM") {
          this.normlaExam.splice(this.index, 1);
        } else {
          this.scheduleExam.splice(this.index, 1);
        }
        this.toast.showSuccess(data.message, 'Success')
      },
      error: (er: any) => {
        this.toast.showError(er.error.message, 'Error')
      }
    })
  }

  getAllExams() {
    this.subjectService.getAllSubjectExamNormalAndSchedule(this.subjectId).subscribe({
      next: (data: any) => {
        this.normlaExam = data.normlaExam;
        this.scheduleExam = data.scheduleExam;
      },
      error: (er: any) => {

      }
    })
  }

  setExamId(id: any) {
    this.subjectExamId = id as number
    let text = document.getElementById('exampleModalLabel1')
    text!.innerText = "Edit Exam";
  }

  public updateSubjectExam() {

    this.subjectService.updateSubjectExam(this.exam).subscribe({
      next: (data: any) => {
        this.toast.showSuccess(data.message, 'Success');
        AppUtils.modelDismiss('close-exam-edit-form')

        if (data.exam.examType == "NORMALEXAM") {
          this.normlaExam = this.normlaExam.map(obj => (obj.examId == data.exam.examId ? data.exam : obj))
        } else if (data.exam.examType == "SCHEDULEEXAM")
          this.scheduleExam = this.scheduleExam.map(obj => (obj.examId == data.exam.examId ? data.exam : obj))

        this.examForm.reset()
        this.updateExam = new Exam();
        this.exam = new Exam();
      },
      error: (er: any) => {
        this.toast.showError(er.error.message, 'Error')
      }
    })
  }
  clearExam() {
    this.exam = new Exam()
  }

  getNormalExamById(obj: any,) {
    this.initiaLiseExamform()
    setTimeout(() => {
      this.exam = obj;
    }, 500);

  }

  getScheduleExamById(id: any) {
    this.exam = { ...this.scheduleExam.find(obj => obj.examId == id) as Exam }
    console.log(this.exam);
    this.isScheduleForm = true
    this.addScheduleFormField();
  }

  questions: QuizeQuestion[] = []
  questionIndex!: number;
  public Editor = ClassicEditor;
  question: QuizeQuestion = new QuizeQuestion();

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
          this.questions = data.questions;
          this.totalChapterExamQuestion = data.questionCount;
          this.initiaLiseExamform()

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
            this.toast.showError(er.error.message, 'Error')
          }
        }
      )
    }
  }
  isScheduleForm!: boolean
  public openScheduleField() {
    //const test = document.querySelector('scheduleTest')
    var checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    //var secondRow = document.getElementById('scheduleTest');
    // secondRow!.style.display = checkbox!.checked ? 'block' : 'none';
    this.isScheduleForm = checkbox!.checked
    if (checkbox!.checked) {
      this.addScheduleFormField()
    } else {
      this.initiaLiseExamform()
    }
    console.log(this.examForm);

  }
  addScheduleFormField() {
    this.examForm = this.formBuilder.group({
      totalQuestionForTest: ['', Validators.required],
      examTimer: ['', Validators.required],
      examName: ['', Validators.required],
      passingMarks: ['', Validators.required],
      examStartTime: ['', Validators.required],
      scheduleTestDate: ['', Validators.required],
    })
  }

  closeScheduleExamField() {
    // var secondRow = document.getElementById('scheduleTest');
    // secondRow!.style.display = 'none';
  }
}