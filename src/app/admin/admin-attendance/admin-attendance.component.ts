import { AbsentTodays } from './../../entity/absent-todays';
import { Component, HostListener, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { error, log } from 'console';
import { ActiveLeaves } from 'src/app/entity/active-leaves';
import { Leaves } from 'src/app/entity/leaves';
import { TodayLeavesRequest } from 'src/app/entity/today-leaves-request';

import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ChartComponent } from "ng-apexcharts";
import { ViewChild } from "@angular/core";
import { PresentAndEarlyCheckout } from 'src/app/entity/present-and-early-checkout';

export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  colors: any
  legend: any;
  stroke: any;
};
@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.scss']
})
export class AdminAttendanceComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  absentData: AbsentTodays[] = []
  leavesData: ActiveLeaves[] = []
  leavesRequestData: TodayLeavesRequest[] = []

  leaveWidth = 0;
  absentWidth = 0;
  presentWidth = 0;

  attendanceFilter='Absent'
  presentAbsentAndEarlyCheckoutLength = 0;
  totalLeavesRequests = 0;

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  totalAbsent: number = 0;
  totalPresent: number = 0;
  totaOnleaves: number = 0;

  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) {

    this.chartOptions = {
      series: [75, 20, 5],
      chart: {
        width: 320,
        type: "donut",
        toolbar: {
          show: false // Hide the default toolbar
        }
      },
      colors: ["#5754E5", "#FF4A11", "#F8961E"],

      labels: ["Present", "Absent", "Leaves"],
      legend: {
        position: "bottom", // Show the legend at the bottom

        // formatter: function (seriesName:any, opts:any) {
        //   const total = opts.w.globals.seriesTotals.reduce((a:any, b:any) => a + b, 0);
        //   const percent = ((opts.w.globals.series[opts.seriesIndex] / total) * 100).toFixed(2);
        //   return seriesName + ": " + percent + "%";
        //}
      },
      stroke: {
        show: false // Set this to false to remove the borders between the series
      },
      responsive: [

        {
          breakpoint: 480,
          options: {
            chart: {
              width: 280


            },
            legend: {
              position: 'bottom'

            }
          }
        }
      ]
    };
  }


  ngOnInit(): void {
   // this.loadStudents();
    this.getTotalStudentTodayLeavesRequest();

    this.getAbsents();
    this.getActiveLeaves();

    this.getMonthWiseAttendanceDataForChart(8)
  }
  public getAbsents() {
    this.studentService.getTodayStudentAbsentData().subscribe(
      (data: any) => {
        
        this.absentData = data.totalAbsent;
        this.totalAbsent = this.absentData.length;
        this.totalPresent = data.totalPresent
        this.presentAbsentAndEarlyCheckoutLength = this.absentData.length
        this.getChartData();
      }
    )
  }
  public getActiveLeaves() {
    this.studentService.getStudentAtiveLeaves().subscribe(
      (data: any) => {
        this.leavesData = data;
        this.totaOnleaves = this.leavesData.length;
        this.getChartData();
      }
    )
  }
  public getTotalStudentTodayLeavesRequest() {
    this.studentService.getTodayLeavesRequest().subscribe(
      (data: any) => {
        this.leavesRequestData = data;
        this.totalLeavesRequests = this.leavesRequestData.length
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
  public getChartData() {
    this.chartOptions.series = [ this.totalPresent,this.totalAbsent, this.totaOnleaves]
  }

  // public manageStrackedBar(absent:number,present:number,leave:number) {
  //   let sum = present + absent + leave
  //   this.presentWidth = this.getPercentage(present, sum);
  //   this.absentWidth = this.getPercentage(absent, sum);
  //   this.leaveWidth = this.getPercentage(leave, sum);
  // }

  // public getPercentage(num: number, sum: number) {
  //   return Math.floor((num / sum) * 100);

  // }
 
  public getTodayAttendanceFilter(value:string){
    this.attendanceFilter = value
    if(value=='Absent')
      this.getAbsents();
    else{
      this.studentService.getTodayAttendanceFilter(value).subscribe({
        next:(data:any)=>{
          this.absentData = data;
          this.presentAbsentAndEarlyCheckoutLength  = this.absentData.length;
        }
      })
    }
  }

  public getMonthWiseAttendanceDataForChart(monthNum:number){
    this.studentService.getMonthWiseAttendanceData(monthNum).subscribe({
      next:(data:any)=>{
        this.leaveWidth = data.OnLeave
        this.absentWidth = data.Absent
        this.presentWidth = data.Present
       // this.manageStrackedBar(data.Absent,data.Present,data.OnLeave);
      }
    })
  }

  
}
