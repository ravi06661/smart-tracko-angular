import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisHour } from 'date-fns';
import { lastDayOfDecade } from 'date-fns/esm';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { QuestionServiceService } from 'src/app/service/question-service.service';

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
  constructor(private questionService: QuestionServiceService, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.params[('id')];
    this.getAllQuestions();
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
        this.questionId = 0;
        this.ngOnInit();
      }, (error) => {
        console.log('errore')
      }
    )
  }
  public updateQuestion() {
    this.questionService.updateQuestionById(this.question).subscribe(
      (data) => {
        alert('success')
      }
    )
  }

  public getQuestionById(id: number) {
    this.questionService.getQuestionById(id).subscribe(
      (data) => {
        this.question = data;
        console.log(data);
        //  this.updateQuestion()
      }
    )
  }

  public Cancel() {
    this.question = new ChapterQuizeQuestion();
  }
}
