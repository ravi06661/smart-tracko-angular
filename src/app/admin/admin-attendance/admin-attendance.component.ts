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
import * as moment from 'moment';
import { DonutChart } from 'src/app/charts/donut-chart';

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
  currentMonth=''

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  totalAbsent: number = 0;
  totalPresent: number = 0;
  totaOnleaves: number = 0;

  attendaceChart:DonutChart = new DonutChart();

  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) {
    this.chartOptions = this.attendaceChart.chartOptions
  }


  ngOnInit(): void {
   // this.loadStudents();
    this.getTotalStudentTodayLeavesRequest();

    this.getAbsents();
    this.getActiveLeaves();
    this.currentMonth = moment(new Date().getMonth()+1, "MM").format("MMMM");
    this.getMonthWiseAttendanceDataForChart(new Date().getMonth()+1);
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

  public manageStrackedBar(absent:number,present:number,leave:number) {
    let sum = present + absent + leave
    this.presentWidth = this.getPercentage(present, sum);
    this.absentWidth = this.getPercentage(absent, sum);
    this.leaveWidth = this.getPercentage(leave, sum);
  }

  public getPercentage(num: number, sum: number) {
    const percentage = (num / sum) * 100;
    const formattedPercentage = percentage.toFixed(2); // Limit to two decimal places
    return parseFloat(formattedPercentage); 
  }
 
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
    this.currentMonth = moment(monthNum, "MM").format("MMMM");
    this.studentService.getMonthWiseAttendanceData(monthNum).subscribe({
      next:(data:any)=>{
        // this.leaveWidth = data.OnLeave
        // this.absentWidth = data.Absent
        // this.presentWidth = data.Present

       this.manageStrackedBar(data.Absent,data.Present,data.OnLeave);

      }
    })
  }

  public changeTimeFormat(time:any){
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }
  
}
