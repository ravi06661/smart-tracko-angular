import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  BASE_URL=this.utilityService.getBaseUrl();
  studentUrl=this.BASE_URL+'/Student';
  TIME_URL=this.utilityService.getTimeUrl();

  constructor(private http: HttpClient,private utilityService:UtilityServiceService, private datepipe: DatePipe) { }

  public getTodayAttendance(studentId: number) {
    return this.http.get(`${this.studentUrl}/getTodayAttendance/${studentId}`);
  }

  public getCurrentTime() {
    return this.http.get(`${this.TIME_URL}`);
  }

  public getAttendanceFromLocalstorage() {
    let attendance = localStorage.getItem('attendance');
    if (attendance != null) {
      attendance = JSON.parse(attendance);
    }
    return attendance;
  }
  
  public getToken() {
    let token = localStorage.getItem('token')
    return token;
  }
  getAttendanceHistory() {
    let currentDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    let joiningDate = this.datepipe.transform("2022-08-01", "yyyy-MM-dd");
    return this.http.get(`${this.studentUrl}/getStudentCheckInCheckOutHistory?startDate=${joiningDate}&endDate=${currentDate}&limit=0&offset=30`)
  }
  
  public getAttendanceFilterData(monthNo: number) {
    return this.http.get(`${this.studentUrl}/studentAttendanceMonthFilter?monthNo=${monthNo}`)
  }

  public getCalenderData(studentId:number,month:number,year:number){
   var params = new HttpParams();
   params=params.append('id',studentId.toString());
   params=params.append('month',month.toString());
   params=params.append('year',year.toString());
    return this.http.get(`${this.studentUrl}/getStudentCalenderData`,{params});
  }

}
