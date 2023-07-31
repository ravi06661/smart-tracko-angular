import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';

@Injectable({
  providedIn: 'root'
})
export class NewsEventServiceService  {
 

  BASE_URL=this.utilityService.getBaseUrl();
  newsEventUrl=this.BASE_URL+'/newsEvents';

  constructor(private http: HttpClient,private utilityService:UtilityServiceService) { }

  public getAllNewsAndEvents(page:number,size:number){
    return this.http.get(`${this.newsEventUrl}/getAllNewsEvents?page=${page}&size=${size}`);
  }

  public getAllNewsAndEventsIsActive(page:number,size:number){
    return this.http.get(`${this.newsEventUrl}/getAllNewsEventsIsActive?page=${page}&size=${size}`);
  }

  public updateActiveAndInActive(id: number) {
    return this.http.put(`${this.newsEventUrl}/activeAndInActiveNewsAndEvent?id=${id}`,{
      responseType:'any'
    })
  }

  public deleteNewsAndEvents(id:number){
    return this.http.delete(`${this.newsEventUrl}/deleteNewsEvents?id=${id}`);
  }

  public searchNewsAndEvents(search:string,role:string,page:number,size:number){
    return this.http.get(`${this.newsEventUrl}/searchNewsAndEvents?search=${search}&role=${role}&page=${page}&size=${size}`);
  }

  public getByNewsById(id:number){
    return this.http.get(`${this.newsEventUrl}/getNewsEvents?id=${id}`);
  }
}
