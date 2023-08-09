import { Component, OnInit } from '@angular/core';
import { TodayLeavesRequest } from 'src/app/entity/today-leaves-request';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-leave-request',
  templateUrl: './admin-leave-request.component.html',
  styleUrls: ['./admin-leave-request.component.scss']
})
export class AdminLeaveRequestComponent implements OnInit {

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  leavesRequestData: TodayLeavesRequest[] = []
  length = 0;
  constructor(private studentService:StudentService,private utilityService: UtilityServiceService) {}


  ngOnInit(): void {
    this.getTotalStudentTodayLeavesRequest();
  }

  public getTotalStudentTodayLeavesRequest() {
    this.studentService.getTodayLeavesRequest().subscribe(
      (data: any) => {
        this.leavesRequestData = data;
        this.length = this.leavesRequestData.length
      }
    )
  }

  public approveStudentLeaveReqeust(id: number, leaveId: number, status: string) {
    this.studentService.approveStudentLeaveReqeust(id, leaveId, status).subscribe(
      (data: any) => {
        this.getTotalStudentTodayLeavesRequest();
      }, (error) => {
      }
    )
  }
}
