import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { ChapterExamResult } from 'src/app/entity/chapter-exam-result';
import { ChapterExamResultResponse } from 'src/app/payload/chapter-exam-result-response';
import { ChatServiceService } from 'src/app/service/chat-service-service.service';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-chapter-result',
  templateUrl: './admin-chapter-result.component.html',
  styleUrls: ['./admin-chapter-result.component.scss']
})
export class AdminChapterResultComponent implements OnInit{
     
  chapterExamResult:any
  chapterId:number=0;

  constructor(private examService:ExamServiceService,private activateRoute:ActivatedRoute,private utilityService: UtilityServiceService){}
  ngOnInit(): void {
    this.chapterId = this.activateRoute.snapshot.params[('chapterId')];
    this.showResult();
  }

  showResult(){

    this.examService.getAllChapterExamResultByChaterId(this.chapterId).subscribe((data:any)=>{
      
      
        this.chapterExamResult=data.examResult

    })
         
  }
}
