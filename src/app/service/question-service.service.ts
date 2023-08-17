import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { Observable } from 'rxjs';
import { ChapterQuizeQuestion } from '../entity/chapter-quize-question';
@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {
  BASE_URL = this.utilityService.getBaseUrl();
  QUESTION_URL = this.BASE_URL + '/question';

  constructor(private utilityService: UtilityServiceService, private http: HttpClient) { }
  public getQuestionByChapterId(chapterId: number): Observable<ChapterQuizeQuestion[]> {
    return this.http.get<ChapterQuizeQuestion[]>(`${this.QUESTION_URL}/getQuestionByChapterId?chapterId=${chapterId}`);
  }
  public deleteQuestionById(questionId:number){
    return this.http.delete(`${this.QUESTION_URL}/deleteQuestionById?questionId=${questionId}`)
  }
}
