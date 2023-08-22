import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
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
  constructor(private utilityService: UtilityServiceService, private questionService: QuestionServiceService, private activateRouter: ActivatedRoute, private subjectService: SubjectService, private chapterService: ChapterServiceService) { }

  ngOnInit() {
    this.chapterId = this.activateRouter.snapshot.params[('id')];
    this.getAllQuestions();
  }
  public getAllQuestions() {
    if (this.chapterId) {
      this.questionService.getAllQuestionByChapterId(this.chapterId).subscribe(
        (data) => {
          this.questions = data;
          this.question = this.questions[0]
        }
      )
    }
  }

  public nextQuestion() {
    if (this.index == this.questions.length-1) {
      this.nextButton = true;
    }
    else {
      this.nextButton = false
      this.previousButton = false;
      this.question = this.questions[this.index=this.index+1]
    }
  }

  public previousQuestion() {
    if (this.index ==0) {
      this.previousButton = true
    }
    else {
      this.previousButton = false;
      this.nextButton = false
      this.question = this.questions[this.index=this.index-1]
    }
  }
}
