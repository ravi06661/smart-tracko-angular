import { Component } from '@angular/core';
import * as moment from 'moment';
import { Attendance } from 'src/app/entity/attendance';
import { LeaveType } from 'src/app/entity/leave-type';
import { Leaves } from 'src/app/entity/leaves';
import { LeaveService } from 'src/app/service/leave.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss']
})
export class AssignmentDetailsComponent {

  
  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/images/';

  selectedDate:any
  attendances:Attendance[]=[];
  attendance:Attendance = new Attendance();
  leaveTypes:LeaveType [] = [];
  leaves:Leaves = new Leaves();
  leavesList:Leaves[] = [];
  leavesModal:Leaves = new Leaves();
  attendanceMonth = 'Month';
  leaveMonth = 'Month';
  totalAttendance:number=0;
  message:string = '';
  color:string = '';



  constructor (private studentService:StudentService,private leaveService:LeaveService,private utilityService:UtilityServiceService) {
   
  }

  public getLeavesFilter(monthNo:number){
    this.leaveMonth = moment(monthNo,"MM").format("MMMM");
    this.leaveService.getLeavesFiterData(monthNo).subscribe({
      next:(res:any)=>{
        this.leavesList = res.LeaveData
      }
    })
  }
  public formattingTimeAndDate(){
    for(let i=0;i<=this.attendances.length;i++){
      this.attendances[i].checkInTime = moment(this.attendances[i].checkInTime, "HH:mm:ss").format("hh:mm:ss A");
      this.attendances[i].checkOutTime = moment(this.attendances[i].checkOutTime, "HH:mm:ss").format("hh:mm:ss A");
      this.attendances[i].checkInDate = moment(this.attendances[i].checkInDate).format('DD MMM YYYY');
      this.attendances[i].workingHour = new Date((this.attendances[i].workingHour)* 1000).toISOString().substr(11, 8);
      }
  }

  public getAttendanceFilter(monthNo:number){
    this.attendanceMonth = moment(monthNo,"MM").format("MMMM");
    this.studentService.getAttendanceFilterData(monthNo).subscribe({
      next:(res:any)=>{
        this.attendances = res.AttendanceData
        this.formattingTimeAndDate();
      }
    })
  }


  public attendanceModal(attendance:Attendance){
    this.attendance = attendance;
  }

  public leaveModal(leave:Leaves){
    this.leavesModal = leave
  }

  public clearData(){
    this.leaves = new Leaves();
    this.message = '';
  }
}
