import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';
import { Fees } from '../entity/fees';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  BASE_URL = this.utilityService.getBaseUrl();
  feesUrl = this.BASE_URL + '/fees';
  TIME_URL = this.utilityService.getTimeUrl();
  profileData: Profile = new Profile();
  constructor(private http: HttpClient, private utilityService: UtilityServiceService) { }

  public addStudentFees(fees: Fees) {

    //let params=new HttpParams();

    let params = new FormData()
    params.append("studentId", fees.student.studentId.toString())
    params.append("courseId", fees.course.courseId.toString())
    params.append("finalFees", fees.finalFees.toString())
    params.append("date", fees.date.toString());
    return this.http.post(`${this.feesUrl}/createStudentFees`, params)
  }
  public getAllFees(page: Number, size: number) {
    return this.http.get<Fees[]>(`${this.feesUrl}/feesListApi?page=${page}&size=${size}`);
  }


  public findByFeesId(feesId:number){
    return this.http.get(`${this.feesUrl}/findByFeesId?feesId=${feesId}`);
  }

  public searchByName(fullName :string){
    return this.http.get(`${this.feesUrl}/searchByName?fullName=${fullName}`);
  }

  public findByDate(startDate:string,endDate:string){
    return this.http.get(`${this.feesUrl}/findFeesByDates?startDate=${startDate}&endDate=${endDate}`);
  }

  public getAllCompletedFeesList(page:number,size:number){
    return this.http.get<Fees[]>(`${this.feesUrl}/feesCompletedList?page=${page}&size=${size}`);
  }

  public updateFeesDetalis(fees:Fees){
    return this.http.put(`${this.feesUrl}/updateFeesApi`, fees);
  }
}
