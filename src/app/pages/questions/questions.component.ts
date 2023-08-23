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
  questionClicked = new Map<number, string>();
  constructor(private utilityService: UtilityServiceService, private questionService: QuestionServiceService, private activateRouter: ActivatedRoute, private subjectService: SubjectService, private chapterService: ChapterServiceService) {
    this.questionClicked = new Map<number, string>();
  }

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
    if (this.index == this.questions.length - 1) {
      this.nextButton = true;
    }
    else {
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
    console.log('click');
    
    if (!this.questionClicked.get(index)) {
      this.questionClicked.set(index, option);
    } else {
      let value = this.questionClicked.get(index);
      if (value !== undefined) {
        this.questionClicked.set(index, value);
      }
    }
    console.log('hh',this.questionClicked);
    
  }

}
