import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

import { Chapter } from 'src/app/entity/chapter';
import { QuizeQuestion } from 'src/app/entity/quize-question';
import { ChapterExamResultResponse } from 'src/app/payload/chapter-exam-result-response';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  chapterId: number = 0;
  index: number = 0
  questions: QuizeQuestion[] = []
  question: QuizeQuestion = new QuizeQuestion();
  previousButton: boolean = false;
  nextButton: boolean = false;
  questionClicked = new Map<number, string>();
  questionAnswered: number = 0;
  questionView: number = 0;
  questionNotAnswered: number = 0
  options: string = ''
  remainingTime: any;
  second: any
  timerSubscription: Subscription | undefined;
  chapterExamResultResponse = new ChapterExamResultResponse
  subjectExamResultResponse = new ChapterExamResultResponse
  subjectId: number = 0;
  chapter = new Chapter;
  totalQuestion = 0;
  questionNumber = 1;

  unrelatedActivityDetected = false;
  subjectExamId!: number
  type!: string
  subjectTimer!: number

  constructor(private questionService: QuestionServiceService, private activateRouter: ActivatedRoute,
    private chapterService: ChapterServiceService,
    private router: Router,
    private loginService: LoginService,
    private examServiceService: ExamServiceService) {
    this.questionClicked = new Map<number, string>();
    this.toggleFullScreen()
  }

  ngOnInit() {
    this.activateRouter.queryParams.subscribe((params: any) => {

      if (params['type'] == "subjectExam") {
        this.subjectExamId = params['subjectExamId']
      } else {
        this.chapterId = params['chapterId'];
      }
      this.type = params['type'];
      this.subjectId = params['subjectId'];
    });


    setTimeout(() => {
      if (this.type == "subjectExam") {
        this.getSubjectExamQuestion();
      } else {
        this.getChapeter();
      }
    }, 500);

  }

  public getSubjectExamQuestion() {
    this.questionService.getAllSubjectExamQuestion(this.subjectId).subscribe({

      next: (data: any) => {
        this.subjectTimer = data.timer;
        this.question = data.questions
        this.questions = data.questions
        this.question = this.questions[0];
        this.questionNotAnswered = this.questions.length;
        setTimeout(() => {
          this.timer();
        }, 500);
      },
      error(err: any) {

      },
    })
  }

  public timer() {
    const duration = 60 * (this.type == "chapterExam" ? this.chapter.exam.examTimer! : this.subjectTimer)// in seconds
    this.timerSubscription = timer(0, 1000).subscribe((elapsedTime: any) => {
      this.second = duration - elapsedTime;
      this.remainingTime = new Date(this.second * 1000).toISOString().substr(11, 8);
      if (elapsedTime >= duration) {
        this.timerSubscription?.unsubscribe();
        this.submittion();
      }
    });
  }

  public submittion() {
    this.chapterExamResultResponse.chapterId = this.chapterId
    this.chapterExamResultResponse.studentId = this.loginService.getStudentId()
    this.chapterExamResultResponse.review = Object.fromEntries(this.questionClicked.entries());
    this.chapterExamResultResponse.subjectId = this.subjectId
    this.examServiceService.addChapterExam(this.chapterExamResultResponse).subscribe(
      (data: any) => {
        this.router.navigate(['result/' + data.id])
      }
    )
  }

  public SubjectExamsubmittion() {
    this.subjectExamResultResponse.studentId = this.loginService.getStudentId()
    this.subjectExamResultResponse.review = Object.fromEntries(this.questionClicked.entries());
    this.subjectExamResultResponse.subjectId = this.subjectId
    this.examServiceService.addSubjectExam(this.chapterExamResultResponse).subscribe(
      (data: any) => {
        this.router.navigate(['result/' + data.id])
      }
    )
  }

  // public getAllQuestions() {
  //   if (this.chapterId) {
  //     this.questionService.getAllQuestionByChapterId(this.chapterId).subscribe(
  //       (data) => {
  //         this.questions = data;
  //         this.question = this.questions[0];
  //         this.questionNotAnswered = this.questions.length;
  //       }
  //     )
  //   }
  // }

  public nextQuestion(id: number) {
    if (this.index == this.questions.length - 1) {
      this.nextButton = true;
    }
    else {
      ++this.questionView
      this.nextButton = false
      this.previousButton = false;
      this.question = this.questions[++this.index]
      this.questionNumber++;
    }
  }

  public previousQuestion() {
    if (this.index == 0) {
      this.previousButton = true
    }
    else {
      this.previousButton = false;
      this.nextButton = false
      this.question = this.questions[--this.index]
      this.questionNumber--;
    }

  }

  questionClick(option: string, index: number) {

    if (this.questionClicked.get(index) == null) {
      ++this.questionAnswered
      --this.questionNotAnswered
      this.questionClicked.set(index, option);
    } else {
      this.questionClicked.set(index, option);
    }

  }

  isFullScreen = false;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    // Check for the keys you want to handle, including the Windows (Super) key
    if (
      event.key.startsWith('F') || // Function keys
      event.key == 'Escape' || // Esc
      event.key == 'Tab' || // Tab
      event.key == 'CapsLock' || // Caps Lock
      event.key == 'Shift' || // Shift
      event.key == 'Control' || // Ctrl
      event.key == 'Alt' || // Alt
      event.key == 'Insert' || // Insert
      event.key == 'Delete' || // Delete
      event.key == 'Meta' // Windows (Super) key
    ) {

      this.type == "subjectExam" ? this.SubjectExamsubmittion() : this.submittion();
      // Call your submission function                 // commented 24
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    if (this.unrelatedActivityDetected) {
      // Automatically submit the test if unrelated activity persists
      // alert("submit");
    } else {
      // Show a warning if unrelated activity is detected
      this.showWarning();
      this.unrelatedActivityDetected = true
    }
  }
  public showWarning() {
    //  alert("Please Don't Change the Window otherwise it will autosubmit");
  }

  // toggleFullScreen() {
  //   const element = document.documentElement;
  //   if (!this.isFullScreen) {
  //     if (element.requestFullscreen) {
  //       element.requestFullscreen();
  //       console.log("if");

  //     }
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //       console.log('else');

  //     }
  //   }
  //   this.isFullScreen = !this.isFullScreen;
  // }

  toggleFullScreen() {
    const element = document.documentElement;

    if (!this.isFullScreen) {
      // Enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
        console.log("Entered fullscreen mode");
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
        console.log('Exited fullscreen mode');
      }
    }

    // Toggle the fullscreen state
    this.isFullScreen = !this.isFullScreen;
  }



  public getChapeter() {
    this.chapterService.getChapterById(this.chapterId).subscribe(
      (data: any) => {
        this.questions = this.shuffleList(data.chapter.exam.questions);
        this.question = this.questions[0];
        this.questionNotAnswered = this.questions.length;
        this.chapter = data.chapter;
        this.timer();
      }
    )
  }

  public shuffleList<T>(list: T[]): T[] {
    return [...list].sort(() => Math.random() - 0.5);
  }

  public clickQuitButton() {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'you want quit the test',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // this.toggleFullScreen()
        //this.router.navigate(['/student/chapterDetails/' + this.chapterId])
        this.timerSubscription?.unsubscribe();
        //  this.submittion();
        this.type == "subjectExam" ? this.SubjectExamsubmittion() : this.submittion();
      }
    })
  }

  public clickSubmitButton() {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'you want submit the test',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // this.toggleFullScreen()
        // this.router.navigate(['/student/chapterDetails/' + this.chapterId])
        this.timerSubscription?.unsubscribe();
        //  this.submittion();
        this.type == "subjectExam" ? this.SubjectExamsubmittion() : this.submittion();
      }
    })
  }

  public manageQuestionProgressBar(questionId: number) {
    if (this.questionClicked.has(questionId)) {
      // Value is present in the map
      return true;
    } else {
      // Value is not present in the map
      return false;
    }
  }
}
