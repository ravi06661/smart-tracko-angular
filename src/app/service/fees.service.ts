import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  BASE_URL = this.utilityService.getBaseUrl();
  studentUrl = this.BASE_URL + '/student';
  TIME_URL = this.utilityService.getTimeUrl();
  profileData: Profile = new Profile();
  constructor(private http: HttpClient, private utilityService: UtilityServiceService) { }



}
