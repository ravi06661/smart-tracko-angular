import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { ChapterExamResult } from 'src/app/entity/chapter-exam-result';
import { ChatServiceService } from 'src/app/service/chat-service-service.service';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-chapter-result',
  templateUrl: './admin-chapter-result.component.html',
  styleUrls: ['./admin-chapter-result.component.scss']
})
export class AdminChapterResultComponent implements OnInit{
     
  chapterExamResult:ChapterExamResult[]=[];
  chapterId:number=0;

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  constructor(private examService:ExamServiceService,private activateRoute:ActivatedRoute,private utilityService: UtilityServiceService){}
  ngOnInit(): void {
    this.chapterId = this.activateRoute.snapshot.params[('chapterId')];
    this.showResult();
  }

  showResult(){

    this.examService.getAllChapterExamResultByChaterId(this.chapterId).subscribe((data:any)=>{
      console.log(data);
      
        this.chapterExamResult=data.examResult

    })
         
  }
}
