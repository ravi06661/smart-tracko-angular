import { UtilityServiceService } from './utility-service.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  BASE_URL=this.utilityService.getBaseUrl();
  adminUrl=this.BASE_URL+'/admin';

  constructor(private http: HttpClient,private utilityService:UtilityServiceService) { }

  public adminLogin(adminId:string,password:string){
    return this.http.post(`${this.adminUrl}/adminLoginApi?adminId=${adminId}&password=${password}`,{
      responseType:'any'
    })
  }

}
