import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import * as moment from 'moment';
import {
  ChartComponent
} from "ng-apexcharts";
import { Attendance } from 'src/app/entity/attendance';
import { LeaveType } from 'src/app/entity/leave-type';
import { Leaves } from 'src/app/entity/leaves';
import { LeaveService } from 'src/app/service/leave.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {  ViewEncapsulation } from '@angular/core';
import { log } from 'console';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AttendanceComponent implements OnInit{


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

  ngOnInit(): void {
    this.attendanceMonth = 'Month';
    this.leaveMonth = 'Month';
    this.getAttendanceHistoy();
    this.getLeaveType();
    this.getStudentLeaves();
  }

  public getAttendanceHistoy(){
    this.studentService.getAttendanceHistory().subscribe({
      next:(data:any)=>{
        this.attendances = data.response.attendance;
        this.totalAttendance = this.attendances.length;
        this.formattingTimeAndDate();
      }
    })
  }

  public getLeaveType(){
    this.leaveService.getLeaveType().subscribe({
      next:(res:any)=>{
        this.leaveTypes = res.leaveType
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

  public addStudentLeave(){
    this.leaveService.addLeave(this.leaves).subscribe({
      next:(res:any)=>{
        if(res.message=='SUCCESS'){
          this.leaves = new Leaves();
          this.message = 'Successfully leave applied';
          this.color = 'green';
          this.ngOnInit();
        }else{
          this.color = 'red';
          this.message = 'Something went wrong !!!'
        }
      }
    })
  }

  public getStudentLeaves(){
    this.leaveService.getStudentLeaves().subscribe({
      next:(res:any)=>{
       this.leavesList = res.leavesData.response;
      }
    })
  }

  public getLeavesFilter(monthNo:number){
    this.leaveMonth = moment(monthNo,"MM").format("MMMM");
    this.leaveService.getLeavesFiterData(monthNo).subscribe({
      next:(res:any)=>{
        this.leavesList =res.leavesData.response;
      //  if(res.leavesData.response.length==0){
      //   this.leavesList=res.leavesData.response;
      //  }
      }
    })
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
