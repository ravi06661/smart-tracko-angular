import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild ,HostListener } from '@angular/core';
import * as moment from 'moment';
import { ChartComponent } from 'ng-apexcharts';
import { Attendance } from 'src/app/entity/attendance';
import { LeaveType } from 'src/app/entity/leave-type';
import { Leaves } from 'src/app/entity/leaves';
import { LeaveService } from 'src/app/service/leave.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ViewEncapsulation } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { PresentAbsentLeaveBarChart } from 'src/app/charts/present-absent-leave-bar-chart';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  @ViewChild('chart') chart: ChartComponent | undefined;
  public attendanceOptions: Partial<ChartOptions>;

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';

  monthCategories: string[] = [];
  selectedDate: any;
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
  absentMap = new Map<number, number>();
  mispunchMap = new Map<number, number>();
  earlyCheckOutMap = new Map<number, number>();
  attendanceChart: PresentAbsentLeaveBarChart =
    new PresentAbsentLeaveBarChart();

  minStart:any
  minEnd:any

  applyLeaveForm: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private leaveService: LeaveService,
    private utilityService: UtilityServiceService,
    private loginService: LoginService
  ) {

    let today = new Date
    today.setDate(today.getDate() + 1)
    this.minStart = today.toISOString().slice(0, 10);
    this.presentsMap = new Map();
    this.attendanceOptions = this.attendanceChart.attendanceOptions;

    this.applyLeaveForm = this.formBuilder.group({
      leaveTypeId: ['', Validators.required],
      leaveDayType: ['', Validators.required],
      halfDayType: ['', Validators.required],
      leaveDate: ['', Validators.required],
      leaveEndDate: ['', Validators.required],
      leaveReason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.attendanceMonth = 'Month';
    this.leaveMonth = 'Month';
    this.getAttendanceHistoy();
    // this.getLeaveType();
    this.getStudentLeaves();
    this.getStudentPresentsAbsentsAndLeavesYearWise();
  }

  public isFieldInvalidForApplyLeaveForm(fieldName: string): boolean {
    const field = this.applyLeaveForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public checkApplyLeaveForm() {
    Object.keys(this.applyLeaveForm.controls).forEach((key) => {
      const control = this.applyLeaveForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  public getAttendanceHistoy() {
    this.studentService.getAttendanceHistory().subscribe({
      next: (data: any) => {
        this.attendances = data.response.attendance;
        if (this.attendance)
          this.totalAttendance = this.attendances.length;
        this.formattingTimeAndDate();
      },
    });
  }

  public getLeaveType() {
    this.leaveService.getLeaveType().subscribe({
      next: (res: any) => {
        this.leaveTypes = res.leaveType;
      },
    });
  }

  public formattingTimeAndDate() {
    if (this.attendances.length !== 0) {
      for (let i = 0; i < this.attendances.length; i++) { // Change <= to < here
        this.attendances[i].checkInTime = moment(
          this.attendances[i].checkInTime,
          'HH:mm:ss'
        ).format('hh:mm:ss A');
        this.attendances[i].checkOutTime = moment(
          this.attendances[i].checkOutTime,
          'HH:mm:ss'
        ).format('hh:mm:ss A');
        this.attendances[i].checkInDate = moment(
          this.attendances[i].checkInDate
        ).format('DD MMM YYYY');
        this.attendances[i].workingHour = new Date(
          this.attendances[i].workingHour * 1000
        )
          .toISOString()
          .substr(11, 8);
      }
    }
  }

  public addStudentLeave() {
    if (  this.applyLeaveForm.invalid ) {
      this.checkApplyLeaveForm();
      console.log(this.applyLeaveForm.invalid);
      return;
    }
    this.leaveService.addLeave(this.leaves).subscribe({
      next: (res: any) => {
        if (res.message == 'SUCCESS') {
          this.leaves = new Leaves();
          this.message = 'Successfully leave applied';
          this.color = 'green';
          this.leaves = new Leaves();
          this.getStudentLeaves();
        }
      },
      error: (err: any) => {
        this.color = 'red';
        this.message = err.error.message;
      },
    });
  }

  public getStudentLeaves() {
    this.leaveService
      .getStudentLeaves(this.loginService.getStudentId())
      .subscribe({
        next: (res: any) => {
          this.leavesList = res.leavesData.response;
        },
      });
  }

  public getLeavesFilter(monthNo: number) {
    this.leaveMonth = moment(monthNo, 'MM').format('MMMM');
    this.leaveService
      .getLeavesFiterData(this.loginService.getStudentId(), monthNo)
      .subscribe({
        next: (res: any) => {
          this.leavesList = res.leavesData.response;
        },
      });
  }

  public getAttendanceFilter(monthNo: number) {
    this.attendanceMonth = moment(monthNo, 'MM').format('MMMM');
    this.studentService.getAttendanceFilterData(monthNo).subscribe({
      next: (res: any) => {
        this.attendances = res.AttendanceData;
        this.formattingTimeAndDate();
      },
    });
  }

  public attendanceModal(attendance: Attendance) {
    this.attendance = attendance;
  }

  public leaveModal(leave: Leaves) {
    this.leavesModal = leave;
  }

  public clearData() {
    this.leaves = new Leaves();
    this.message = '';
    this.applyLeaveForm = this.formBuilder.group({
      leaveTypeId: ['', Validators.required],
      leaveDayType: ['', Validators.required],
      halfDayType: ['', Validators.required],
      leaveDate: ['', Validators.required],
      leaveEndDate: ['', Validators.required],
      leaveReason: ['', Validators.required],
    });
  }

  public getStudentPresentsAbsentsAndLeavesYearWise() {
    this.attendanceOptions.series[0].data = [];
    this.studentService
      .getStudentPresentsAbsentsAndLeavesYearWise(
        new Date().getFullYear(),
        this.loginService.getStudentId()
      )
      .subscribe((data: any) => {
        this.presentsMap = data.presents;
        this.leavesMap = data.leaves;
        this.absentMap = data.absents;
        this.mispunchMap = data.mispunch
        this.earlyCheckOutMap = data.earlyCheckOut
        this.setAbsentData();
        this.setPresentData();
        this.setLeavesData();
        this.setEarlyCheckOutData();
        this.setMishPunchData();

      });
  }
  public setPresentData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.presentsMap).map(
      ([key, value]) => [parseInt(key), value]
    );
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[0].data = arr;
  }

  public setLeavesData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.leavesMap).map(
      ([key, value]) => [parseInt(key), value]
    );
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[2].data = arr;  /////
  }

  public setAbsentData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.absentMap).map(
      ([key, value]) => [parseInt(key), value]
    );
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[1].data = arr;
  }
  public setMishPunchData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.mispunchMap).map(
      ([key, value]) => [parseInt(key), value]
    );
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[3].data = arr;
  }
  public setEarlyCheckOutData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.earlyCheckOutMap).map(
      ([key, value]) => [parseInt(key), value]
    );
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.attendanceOptions.series[4].data = arr;
  }

  validFields(field: string) {
    let obj = this.applyLeaveForm.get(field);
    obj!.markAsTouched();
    obj!.updateValueAndValidity();
  }

  public setDate() {
    this.minEnd = this.leaves.leaveDate
  }
}
