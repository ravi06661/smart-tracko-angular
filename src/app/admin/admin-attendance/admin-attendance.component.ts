import { Component, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { error, log } from 'console';
import { AbsentTodays } from 'src/app/entity/absent-todays';
import { ActiveLeaves } from 'src/app/entity/active-leaves';
import { Leaves } from 'src/app/entity/leaves';
import { TodayLeavesRequest } from 'src/app/entity/today-leaves-request';

import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ChartComponent } from "ng-apexcharts";
import { ViewChild } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
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
export class AdminAttendanceComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  absentData: AbsentTodays[] = []
  leavesData: ActiveLeaves[] = []
  leavesRequestData: TodayLeavesRequest[] = []

  leaveWidth = 0
  absentWidth = 0
  presentWidth = 0


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
    /}
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
            legend:{
              position:'bottom'

            }
          }
        }
      ]
    };
  }


  ngOnInit(): void {
    this.manageStrackedBar()
    this.getTotalStudentTodayLeavesRequest();
    this.getAbsents();
    this.getActiveLeaves();

  }
  public getAbsents() {
    this.studentService.getTodayStudentAbsentData().subscribe(
      (data: any) => {
        this.absentData = data.totalAbsent;
        this.totalAbsent = this.absentData.length;
        this.totalPresent = data.totalPresent
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
    this.chartOptions.series = [this.totalAbsent, this.totalPresent, this.totaOnleaves]

  public  manageStrackedBar(){
    let absent = 30;
    let present = 40;
    let leave = 60;
    let sum = present+absent+leave
    this.presentWidth = this.getPercentage(present,sum);
    this.absentWidth = this.getPercentage(absent,sum);
    this.leaveWidth = this.getPercentage(leave,sum);
  }

  public getPercentage(num:number,sum:number){
    return Math.floor((num/sum)*100);

  }
}
