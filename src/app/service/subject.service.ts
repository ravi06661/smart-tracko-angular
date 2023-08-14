import { Injectable, OnInit } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubjectService{
  BASE_URL=this.utilityService.getBaseUrl();
  Subject_url=this.BASE_URL+'/subject';

  constructor(private utilityService:UtilityServiceService,private http:HttpClient) { }

  public saveSubject(subject:any){
    return this.http.post(`${this.Subject_url}/addSubject?subjectName=${subject.subjectName}&imageId=${subject.imageId}`,{
      responseType:'any'
    });
  }

  public getAllSubjects(){
    return this.http.get(`${this.Subject_url}/getAllSubjects`);
  }


}
