import { Injectable, OnInit } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService{
  
  BASE_URL=this.utilityService.getBaseUrl();
  Subject_url=this.BASE_URL+'/subject';
  Chapter_url=this.BASE_URL+'/chapter';

  constructor(private utilityService:UtilityServiceService,private http:HttpClient) { }

  public saveSubject(subject:any){
    return this.http.post(`${this.Subject_url}/addSubject?subjectName=${subject.subjectName}&imageId=${subject.imageId}`,{
      responseType:'any'
    });
  }

  public getAllSubjects(){
    return this.http.get(`${this.Subject_url}/getAllSubjects`);
  }

  public getSubjectById(id: number) {
    return this.http.get(`${this.Subject_url}/getSubjectById?subjectId=${id}`);
  }

  public updateSubject(subject:any){
    return this.http.put(`${this.Subject_url}/updateSubject`,subject);
  }
 
  public getAllSubjectChapters(id:number){
    return this.http.get(`${this.Chapter_url}/getAllChapters?subjectId=${id}`)
  }

  public getAllSubjectByCourseId(id:number) {
    return this.http.get(`${this.Subject_url}/getAllSubjectByCourseId?courseId=${id}`)
  }
}
