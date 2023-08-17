import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisHour } from 'date-fns';
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
  constructor(private questionService: QuestionServiceService, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.params[('id')];
    this.getQuestions();
  }
  public getQuestions() {

    if (this.id) {
      this.questionService.getQuestionByChapterId(this.id).subscribe(
        (data) => {
          this.questions = data;
        }
      )
    }
  }
  public deleteQuestion() {
    this.questionService.deleteQuestionById(this.questionId).subscribe(
      (data) => {
        this.router.navigate(['/admin/chapterquiz/'+this.questionId])
        this.ngOnInit()
       }
    )
  }

}
