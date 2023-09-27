import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { ChapterExamResultResponse } from '../payload/chapter-exam-result-response';

@Injectable({
  providedIn: 'root'
})
export class ExamServiceService {

  BASE_URL = this.utilityService.getBaseUrl();
  EXAM_URL = this.BASE_URL + '/exam';

  constructor(private http: HttpClient, private utilityService: UtilityServiceService) { }
  
  public addChapterExam(data: ChapterExamResultResponse) {
    console.log(data);  
    return this.http.post(`${this.EXAM_URL}/addChapterExam`, data)
  }

  public getChapterExamResult(id: number) {
    return this.http.get(`${this.EXAM_URL}/getChapterExamResult?resultId=${id}`);
  }

  public getExamResultByChpaterIdAndStudentId(chapterId:number,studentId:number){
    return this.http.get(`${this.EXAM_URL}/getExamResultByChapterIdAndStudentId?chapterId=${chapterId}&studentId=${studentId}`);
  }

  public getChapterExamIsCompleted(chapterId:number,studentId:number){
    return this.http.get(`${this.EXAM_URL}/checkExamCompleteOrNot?chapterId=${chapterId}&studentId=${studentId}`);
  }
}
