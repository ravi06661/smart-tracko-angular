import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { AttendanceLog } from 'src/app/entity/attendance-log';
import { Leaves } from 'src/app/entity/leaves';
import { StudentDetails } from 'src/app/entity/student-details';
import { LeaveService } from 'src/app/service/leave.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';


export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  legend:any;
  colors:any;
};

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit{
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  BASE_URL=this.utilityService.getBaseUrl();  
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  studentId:number=0;
  student:StudentDetails=new StudentDetails();
  attendanceLog:AttendanceLog[] = [];
  leavesList: Leaves[] = [];
  leaveMonth = 'Month';

  constructor(private utilityService:UtilityServiceService,private activateRoute:ActivatedRoute,
    private studentService:StudentService,private leaveService:LeaveService){
      this.chartOptions = {
        series: [33, 33, 33],
        chart: {
          width: 300,
          type: "pie"
        },
        colors: ["#5754E5", "#FF4A11", "#F8961E"],
        legend:{position:'bottom'},
        labels: ["Present", "Absent", "Leave"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
            }
          }
        ]
      };
    }
  
  
  
  
  ngOnInit(): void {
    
    this.studentId=this.activateRoute.snapshot.params[('studentId')];
    this.getStudentProfileData();
  }

  public getStudentProfileData(){
    this.studentService.getStudentProfileData(this.studentId).subscribe({
      next:(data:any)=>{
        this.student = data;
      }
    })
  }
  public updateStudent(){
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.updateStudent(this.student).subscribe({
          next:(res:any)=>{
           this.student=res
          }
          })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        this.getStudentProfileData()
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  public getStudentOverAllAttendancesAndLeaves(){
    this.studentService.getStudentOverAllAttendancesAndLeave(this.studentId).subscribe({
      next:(data:any)=>{
        this.attendanceLog = data.attendanceList;
        this.chartOptions.series=[data.presentsCount,0,data.leavesCount];
      }
    })
  }

  public changeTimeFormat(time:any){
    return moment(time, "HH:mm:ss").format("hh:mm:ss A");
  }

  public timerFormate(seconds:number){
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  public getStudentLeaves() {
    this.leaveMonth = 'Month';
    this.leaveService.getStudentLeaves(this.studentId).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;
        
      }
    })
  }

  public getLeavesFilter(monthNo: number) {
    this.leaveMonth = moment(monthNo, "MM").format("MMMM");
    this.leaveService.getLeavesFiterData(this.studentId,monthNo).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;
      }
    })
  }
}
