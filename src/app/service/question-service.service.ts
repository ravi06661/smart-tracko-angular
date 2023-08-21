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
  public updateQuestionById(question: ChapterQuizeQuestion,chapterId:number) {
    let formData = new FormData();
    formData.append('chapterId', chapterId.toString())
    formData.append('questionContent', question.questionContent);
    formData.append('correctOption', question.correctOption)
    formData.append('option1', question.option1)
    formData.append('option2', question.option2)
    formData.append('option3', question.option3)
    formData.append('option4', question.option4)
    formData.append('questionId',question.questionId.toString())
    formData.append('image',question.questionImage)
    return this.http.put(`${this.QUESTION_URL}/updateQuestionById`, formData);
  }
  public addQuestion(question: ChapterQuizeQuestion, chapterId: number): Observable<ChapterQuizeQuestion> {

    let formData = new FormData();
    formData.append('chapterId', chapterId.toString())
    formData.append('questionContent', question.questionContent);
    formData.append('correctOption', question.correctOption)
    formData.append('option1', question.option1)
    formData.append('option2', question.option2)
    formData.append('option3', question.option3)
    formData.append('option4', question.option4)
    formData.append('image', question.questionImage)
    console.log(question.questionImage);
    
    return this.http.post<ChapterQuizeQuestion>(`${this.QUESTION_URL}/addQuestionToChapter`, formData)
  }
}
