import { Component, OnInit } from '@angular/core';
import { AbsentTodays } from 'src/app/entity/absent-todays';
import { ActiveLeaves } from 'src/app/entity/active-leaves';
import { Leaves } from 'src/app/entity/leaves';

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
  leavesData:ActiveLeaves[]=[]
  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) { }
  ngOnInit(): void {
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
        // console.log(data);
        this.leavesData =data;
        console.log(this.leavesData);
        
      }
    )
  }
}
