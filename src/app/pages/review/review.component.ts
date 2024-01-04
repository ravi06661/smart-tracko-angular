import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterExamResult } from 'src/app/entity/chapter-exam-result';
import { ChapterQuizeQuestion } from 'src/app/entity/chapter-quize-question';
import { Question } from 'src/app/entity/question';
import { QuestionResponse } from 'src/app/payload/question-response';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  resultId = 0
  chapterExamResult: ChapterExamResult = new ChapterExamResult
  questionResponse:QuestionResponse[]=[]
  review = new Map<number, string>;
  question: ChapterQuizeQuestion[] = []
  constructor(private activateRoute: ActivatedRoute, private examService: ExamServiceService) { }
  ngOnInit(): void {
    this.resultId = this.activateRoute.snapshot.params['id'];
    this.examService.getChapterExamResult(this.resultId).subscribe({
      next: (data: any) => {
        this.chapterExamResult = data.examResult
        this.questionResponse = data.questions
        this.review = new Map<number, string>(
          Object.entries(this.chapterExamResult.review).map(([key, value]) => [Number(key), value])
        );
      }
    })
  }
}
