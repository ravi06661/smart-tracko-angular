import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
@Injectable({
  providedIn: 'root'
})
export class CourseServiceService {

  BASE_URL=this.utilityService.getBaseUrl();
  courseUrl=this.BASE_URL+'/course';

  constructor(private http: HttpClient,private utilityService:UtilityServiceService) { }

  public getAllCourses(page:number,size:number){
    return this.http.get(`${this.courseUrl}/findAllCourseApi?page=${page}&size=${size}`);
  }
}
