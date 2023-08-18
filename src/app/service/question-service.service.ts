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
  public getAllQuestionByChapterId(chapterId: number): Observable<ChapterQuizeQuestion[]> {
    return this.http.get<ChapterQuizeQuestion[]>(`${this.QUESTION_URL}/getAllQuestionByChapterId?chapterId=${chapterId}`);
  }
  public deleteQuestionById(questionId: number) {
    return this.http.put(`${this.QUESTION_URL}/deleteQuestionById?questionId=${questionId}`, null)
  }
  public getQuestionById(questionId: number): Observable<ChapterQuizeQuestion> {
    return this.http.get<ChapterQuizeQuestion>(`${this.QUESTION_URL}/getQuestionById?questionId=${questionId}`);
  }
  public updateQuestionById(question: ChapterQuizeQuestion) {
    return this.http.post(`${this.QUESTION_URL}/updateQuestionById`, question);
  }
}
