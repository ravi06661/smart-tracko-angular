import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { ViewEncapsulation } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { en } from '@fullcalendar/core/internal-common';
import { arrayBuffer } from 'stream/consumers';
import { PresentAbsentLeaveBarChart } from 'src/app/charts/present-absent-leave-bar-chart';

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  xaxis: any;
  colors: any;
  yaxis: any;
};

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AttendanceComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public attendanceOptions: Partial<ChartOptions>;

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';

  monthCategories: string[] = []
  selectedDate: any
  attendances: Attendance[] = [];
  attendance: Attendance = new Attendance();
  leaveTypes: LeaveType[] = [];
  leaves: Leaves = new Leaves();
  leavesList: Leaves[] = [];
  leavesModal: Leaves = new Leaves();
  attendanceMonth = 'Month';
  leaveMonth = 'Month';
  totalAttendance: number = 0;
  message: string = '';
  color: string = '';
  presentsMap = new Map<number, number>();
  leavesMap = new Map<number, number>();
  attendanceChart:PresentAbsentLeaveBarChart = new PresentAbsentLeaveBarChart();

  constructor(private cdr: ChangeDetectorRef, private studentService: StudentService, private leaveService: LeaveService, private utilityService: UtilityServiceService, private loginService: LoginService) {
    this.presentsMap = new Map();
    this.attendanceOptions = this.attendanceChart.attendanceOptions
  }

  ngOnInit(): void {
    this.attendanceMonth = 'Month';
    this.leaveMonth = 'Month';
    this.getAttendanceHistoy();
    this.getLeaveType();
    this.getStudentLeaves();
    this.getStudentPresentsAbsentsAndLeavesYearWise();
  }

  public getAttendanceHistoy() {
    this.studentService.getAttendanceHistory().subscribe({
      next: (data: any) => {
        this.attendances = data.response.attendance;
        this.totalAttendance = this.attendances.length;
        this.formattingTimeAndDate();
      }
    })
  }

  public getLeaveType() {
    this.leaveService.getLeaveType().subscribe({
      next: (res: any) => {
        this.leaveTypes = res.leaveType
      }
    })
  }


  public formattingTimeAndDate() {
    for (let i = 0; i <= this.attendances.length; i++) {
      this.attendances[i].checkInTime = moment(this.attendances[i].checkInTime, "HH:mm:ss").format("hh:mm:ss A");
      this.attendances[i].checkOutTime = moment(this.attendances[i].checkOutTime, "HH:mm:ss").format("hh:mm:ss A");
      this.attendances[i].checkInDate = moment(this.attendances[i].checkInDate).format('DD MMM YYYY');
      this.attendances[i].workingHour = new Date((this.attendances[i].workingHour) * 1000).toISOString().substr(11, 8);
    }
  }

  public addStudentLeave() {
    this.leaveService.addLeave(this.leaves).subscribe({
      next: (res: any) => {
        if (res.message == 'SUCCESS') {
          this.leaves = new Leaves();
          this.message = 'Successfully leave applied';
          this.color = 'green';
          this.ngOnInit();
        } else {
          this.color = 'red';
          this.message = 'Something went wrong !!!'
        }
      }
    })
  }

  public getStudentLeaves() {
    this.leaveService.getStudentLeaves(this.loginService.getStudentId()).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;
      }
    })
  }

  public getLeavesFilter(monthNo: number) {
    this.leaveMonth = moment(monthNo, "MM").format("MMMM");
    this.leaveService.getLeavesFiterData(this.loginService.getStudentId(),monthNo).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;
      }
    })
  }

  public getAttendanceFilter(monthNo: number) {
    this.attendanceMonth = moment(monthNo, "MM").format("MMMM");
    this.studentService.getAttendanceFilterData(monthNo).subscribe({
      next: (res: any) => {
        this.attendances = res.AttendanceData
        this.formattingTimeAndDate();
      }
    })
  }

  public attendanceModal(attendance: Attendance) {
    this.attendance = attendance;
  }

  public leaveModal(leave: Leaves) {
    this.leavesModal = leave
  }

  public clearData() {
    this.leaves = new Leaves();
    this.message = '';
  }
  public getStudentPresentsAbsentsAndLeavesYearWise() {
    
    this.attendanceOptions.series[0].data = []
    this.studentService.getStudentPresentsAbsentsAndLeavesYearWise(new Date().getFullYear(), this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.presentsMap = data.presents
        this.leavesMap = data.leaves;
        this.setPresentData();
        this.setLeavesData();
      }
    )
  }
  public setPresentData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.presentsMap).map(([key, value]) => [parseInt(key), value]);
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[0].data = arr;
    
  }

  public setLeavesData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.leavesMap).map(([key, value]) => [parseInt(key), value]);
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[2].data = arr;
    
  }
}
