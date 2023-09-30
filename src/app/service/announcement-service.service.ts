import { HttpClient } from '@angular/common/http';
import { AnnouncementRequest } from './../payload/announcement-request';
import { UtilityServiceService } from './utility-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementServiceService {
 
  BASE_URL = this.utilityService.getBaseUrl();
  ANNOUNCEMENT_URL = this.BASE_URL+'/announcement';

  constructor(private utilityService:UtilityServiceService,
    private http:HttpClient) { }

  public publishAnnouncement(request:AnnouncementRequest){
    return this.http.post(`${this.ANNOUNCEMENT_URL}/publishAnnouncement`,request);
  }

  public getAllPublishedAnnouncement(page: number, size: number) {
    return this.http.get(`${this.ANNOUNCEMENT_URL}/getAllAnnouncement?page=${page}&size=${size}`);
  }

  public getAnnouncementForStudent(studentId: any) {
    return this.http.get(`${this.ANNOUNCEMENT_URL}/getAnnouncementForStudent?studentId=${studentId}`);
  }

  public seenMassageByStudent(announcementId: number, studentId: number) {
    return this.http.post(`${this.ANNOUNCEMENT_URL}/seenAnnouncement?announcementId=${announcementId}&studentId=${studentId}`,{
      responseType : 'any'
    })
  }

  public countUnseenNotificationForStudent(studentId:number) {
   return this.http.get(`${this.ANNOUNCEMENT_URL}/getNotificationCountForStudent?studentId=${studentId}`);
  }
  
  
}
