import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterExamResult } from 'src/app/entity/chapter-exam-result';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  resultId = 0
  chapterExamResult: ChapterExamResult = new ChapterExamResult
  constructor(private activateRoute: ActivatedRoute, private examService: ExamServiceService, private router: Router) { }

  ngOnInit(): void {
    this.resultId = this.activateRoute.snapshot.params['id'];
    this.examService.getChapterExamResult(this.resultId).subscribe({
      next: (data: any) => {
        this.chapterExamResult = data.examResult;
      }
    })
  }

  isFullScreen = true;
  toggleFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullScreen = !this.isFullScreen;
    }
  }
  exite() {
    this.toggleFullScreen();
    this.router.navigate(['/student'])
  }
}
