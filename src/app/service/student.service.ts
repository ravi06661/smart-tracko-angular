import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';
import { LoginService } from './login.service';
import { LeaveService } from './leave.service';
import { TodayLeavesRequest } from '../entity/today-leaves-request';
import { Observable } from 'rxjs';
import { StudentDetails } from '../entity/student-details';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  BASE_URL = this.utilityService.getBaseUrl();
  studentUrl = this.BASE_URL + '/student';
  TIME_URL = this.utilityService.getTimeUrl();
  profileData: Profile = new Profile();

  constructor(private http: HttpClient, private utilityService: UtilityServiceService, private datepipe: DatePipe, public loginService: LoginService) { }

  public registerStudent(data: StudentDetails) {
    console.log('kapil rathore ', data);

    return this.http.post(`${this.studentUrl}/registerStudent`, data);
  }

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

  public getCalenderData(studentId: number, month: number, year: number) {
    var params = new HttpParams();
    params = params.append('id', studentId.toString());
    params = params.append('month', month.toString());
    params = params.append('year', year.toString());
    return this.http.get(`${this.studentUrl}/getStudentCalenderData`, { params });
  }


  public getStudentHeaderProfileData() {
    if (this.profileData.studentId == 0) {

      let id = this.loginService.getStudentId();
      this.http.get(`${this.studentUrl}/getStudentData/${id}`).subscribe(
        (data: any) => {
          this.profileData.name = data.studentName;
          this.profileData.profilePic = data.profilePic;
          this.profileData.course = data.course;
          this.profileData.studentId = data.id
          console.log(this.profileData)
        }, (error) => {
          console.log(error);
        }
      )
      return this.profileData
    } else {
      if (this.profileData.studentId != this.loginService.getStudentId()) {
        this.profileData = new Profile();
        this.getStudentHeaderProfileData()
      }
      return this.profileData
    }
  }

  public getTodayStudentAbsentData() {
    return this.http.get(`${this.studentUrl}/getTotalTodayAbsentStudentAndPresent`);
  }
  public getStudentAtiveLeaves() {
    return this.http.get(`${this.studentUrl}/getTotalStudentInLeaves`);
  }
  public getTodayLeavesRequest(): Observable<TodayLeavesRequest> {
    return this.http.get<TodayLeavesRequest>(`${this.studentUrl}/getTotalStudentTodaysInLeaves`);
  }
  public approveStudentLeaveReqeust(studentId: number, leaveId: number, status: string) {
    return this.http.put(`${this.studentUrl}/approveStudentLeaveReqeust/${studentId}/${leaveId}/${status}`, null);
  }

  public getAllStudent(page: Number, size: number) {
    return this.http.get<StudentDetails[]>(`${this.studentUrl}/getAllStudentData?page=${page}&size=${size}`);
  }

  public searchStudentByName(fullName: string) {
   

    return this.http.get<StudentDetails[]>(`${this.studentUrl}/searchStudentByName?fullName=${fullName}`)
  }

  public getByStudentById(studentId: number) {
    return this.http.get(`${this.studentUrl}/getStudentById?studentId=${studentId}`);
  }

  public getStudentProfileData(studentId: number) {
    return this.http.get(`${this.studentUrl}/getStudentForWebStudentProfile?studentId=${studentId}`);
  }

  public updateStudent(student: StudentDetails) {
    return this.http.put(`${this.studentUrl}/updateStudentApi`, student);
  }

  public getStudentOverAllAttendancesAndLeave(studentId: number) {
    return this.http.get(`${this.studentUrl}/getStudentOverAllAttendanceAndLeavesAndAbsents?studentId=${studentId}`);
  }

  public getTodayAttendanceFilter(value: string) {
    return this.http.get(`${this.studentUrl}/getTodaysPresentsAndEarlyCheckouts?key=${value}`);
  }

  public getMonthWiseAttendanceData(monthNum: number) {
    return this.http.get(`${this.studentUrl}/getMonthwiseAttendence?month=${monthNum}`);
  }

  public getAdmissinonDataByWiseForYear(year: number) {
    return this.http.get(`${this.studentUrl}/getMonthwiseAdmissionCountForYear?year=${year}`);
  }
  public getStudentPresentsAbsentsAndLeavesYearWise(year: number, studentId: number) {
    return this.http.get(`${this.studentUrl}/getStudentPresentsAbsentsAndLeavesYearWise?year=${year}&studentId=${studentId}`);
}


public allStudent(){
  return this.http.get(`${this.studentUrl}/allStudent`);
}

}
