import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ChapterExamResult } from 'src/app/entity/chapter-exam-result';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  resultId = 0
  chapterExamResult: ChapterExamResult = new ChapterExamResult
  review = new Map<number,string>;
  constructor(private activateRoute: ActivatedRoute, private examService: ExamServiceService) { }
  ngOnInit(): void {
    this.resultId = this.activateRoute.snapshot.params['id'];
    this.examService.getChapterExamResult(this.resultId).subscribe({
      next: (data: any) => {
        this.chapterExamResult = data.examResult
        this.chapterExamResult.chapter.questions = data.questions
        //  this.review = this.chapterExamResult.review
         
          this.review = new Map<number, string>(
            Object.entries(this.chapterExamResult.review).map(([key, value]) => [Number(key), value])
          );
          console.log('rrr',this.review);
      }
    })  
  }
}
