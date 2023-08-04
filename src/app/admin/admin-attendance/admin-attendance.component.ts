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

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  totalAbsent: number = 0;
  totalPresent: number = 0;
  totaOnleaves: number = 0;

  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) {

    this.chartOptions = {
      series: [],
      chart: {
        type: "donut"
      },
      labels: ["Absent", "Present", "OnLeaves"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  ngOnInit(): void {
    this.getTotalStudentTodayLeavesRequest();
    this.getAbsents();
    this.getActiveLeaves();
    
  }
  public getAbsents() {
    this.studentService.getTodayStudentAbsentData().subscribe(
      (data: any) => {
        this.absentData = data.totalAbsent;
        this.totalAbsent = this.absentData.length;
        this.totalPresent =data.totalPresent
        this.getChartData();
      }
    )
  }
  public getActiveLeaves() {
    this.studentService.getStudentAtiveLeaves().subscribe(
      (data: any) => {
        this.leavesData = data;
        this.totaOnleaves = this.leavesData.length;
        console.log('activeLeaves', this.leavesData);
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
    console.log(this.totaOnleaves);
    console.log(this.totalAbsent);
    this.chartOptions.series = [this.totalAbsent,this.totalPresent,this.totaOnleaves]
  }
}
