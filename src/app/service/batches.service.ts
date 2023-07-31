import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {
  BASE_URL=this.utilityService.getBaseUrl();
  courseUrl=this.BASE_URL+'/batch';

  constructor(private http: HttpClient,private utilityService:UtilityServiceService) { }

  public getAllBatch(){
    return this.http.get(`${this.courseUrl}/getAllBatches`);
  }
}