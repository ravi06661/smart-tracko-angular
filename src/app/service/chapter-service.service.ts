import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Chapter } from '../entity/chapter';
import { ChapterContent } from '../entity/chapter-content';

@Injectable({
  providedIn: 'root'
})
export class ChapterServiceService {
  BASE_URL = this.utilityService.getBaseUrl();
  CHAPTER_URL = this.BASE_URL + '/chapter';

  constructor(private utilityService: UtilityServiceService,private http :HttpClient) { }

  public getAllChapter(id:number){
    return this.http.get(`${this.CHAPTER_URL}/getAllChapters?subjectId=${id}`)
  }
  public getChapterById(id:number):Observable<Chapter>{
    return this.http.get<Chapter>(`${this.CHAPTER_URL}/getChapterById?chapterId=${id}`)
  }
}
