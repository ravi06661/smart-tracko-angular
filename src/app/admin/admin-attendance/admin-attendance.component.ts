import { Component, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { error, log } from 'console';
import { AbsentTodays } from 'src/app/entity/absent-todays';
import { ActiveLeaves } from 'src/app/entity/active-leaves';
import { Leaves } from 'src/app/entity/leaves';
import { TodayLeavesRequest } from 'src/app/entity/today-leaves-request';

import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.scss']
})
export class AdminAttendanceComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  absentData: AbsentTodays[] = []
  leavesData: ActiveLeaves[] = []
  leavesRequestData: TodayLeavesRequest[] = []

  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) { }
  ngOnInit(): void {
    this.getTotalStudentTodayLeavesRequest();
    this.getAbsents();
    this.getActiveLeaves();

  }
  public getAbsents() {
    this.studentService.getTodayStudentAbsentData().subscribe(
      (data: any) => {
        this.absentData = data;
      }
    )
  }
  public getActiveLeaves() {
    this.studentService.getStudentAtiveLeaves().subscribe(
      (data: any) => {
        this.leavesData = data;
        console.log('activeLeaves', this.leavesData);
      }
    )
  }
  public getTotalStudentTodayLeavesRequest() {
    this.studentService.getTodayLeavesRequest().subscribe(
      (data: any) => {
        this.leavesRequestData = data;
      }
    )
  }

  public approveStudentLeaveReqeust(id: number, leaveId: number, status: string) {
    this.studentService.approveStudentLeaveReqeust(id, leaveId, status).subscribe(
      (data: any) => {
        this.getTotalStudentTodayLeavesRequest();
        this.getActiveLeaves();
      }, (error) => {
      }
    )
  }
}
