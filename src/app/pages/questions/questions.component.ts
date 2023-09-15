import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { timer } from 'rxjs/internal/observable/timer';
import { Chapter } from 'src/app/entity/chapter';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { ChapterExamResultResponse } from 'src/app/payload/chapter-exam-result-response';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  chapterId: number = 0;
  index: number = 0
  questions: ChapterQuizeQuestion[] = []
  question: ChapterQuizeQuestion = new ChapterQuizeQuestion();
  imageUrl = this.utilityService.getBaseUrl() + "/file/getImageApi/images/";
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
  subjectId: number = 0;
  chapter = new Chapter;
  constructor(private utilityService: UtilityServiceService, private questionService: QuestionServiceService, private activateRouter: ActivatedRoute,
    private subjectService: SubjectService,
    private chapterService: ChapterServiceService,
    private router: Router,
    private loginService: LoginService,
    private examServiceService: ExamServiceService) {
    this.questionClicked = new Map<number, string>();
    this.toggleFullScreen()
  }

  ngOnInit() {

    this.chapterId = this.activateRouter.snapshot.params[('id')];
    this.getAllQuestions();
    this.timer();
    this.getChapeter();
  }
  public timer() {
    const duration = 10// in seconds
    this.timerSubscription = timer(0, 1000).subscribe((elapsedTime) => {
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
    this.chapterExamResultResponse.subjectId =this.subjectId
    this.examServiceService.addChapterExam(this.chapterExamResultResponse).subscribe(
      (data: any) => {
        this.router.navigate(['result/' + data.id])
      }
    )
  }

  public getAllQuestions() {
    if (this.chapterId) {
      this.questionService.getAllQuestionByChapterId(this.chapterId).subscribe(
        (data) => {
          this.questions = data;
          this.question = this.questions[0]
          this.questionNotAnswered = this.questions.length
        }
      )
    }
  }

  public nextQuestion(id: number) {
    if (this.index == this.questions.length - 1) {
      this.nextButton = true;
    }
    else {
      ++this.questionView
      this.nextButton = false
      this.previousButton = false;
      this.question = this.questions[++this.index]
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
    if (event.key.startsWith('F')) {
      this.submittion();
    }
  }
  toggleFullScreen() {
    const element = document.documentElement;
    if (!this.isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    this.isFullScreen = !this.isFullScreen;
  }
  public exite() {
    this.toggleFullScreen()
    this.router.navigate(['/student/chapterDetails/' + this.chapterId])
  }
  public getChapeter() {
    this.chapterService.getChapterById(this.chapterId).subscribe(
      (data:any) => {
        this.subjectId = data.subject.subjectId;
      }
    )
  }
}
