import { DatePipe, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { parseDate } from 'igniteui-angular/lib/core/utils';
import * as moment from 'moment';
import { Observable, interval, map, min, switchMap } from 'rxjs';
import { Attendance } from 'src/app/entity/attendance';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss'],
})
export class RightSideBarComponent implements OnInit {
  timer: number = 0;
  interval: any;
  totalHrs: any;
  totalHrs2: any;

  checkInTime: any
  attendance: Attendance = new Attendance();
  
  clock: Observable<Date> | undefined;
  dateString: Date | undefined;
  formattedDate: string | null | undefined;
  formattedCheckInTime:any
  formattedCheckOutTime:any

  constructor(private studentService: StudentService,
    private loginService:LoginService) {
  }

  ngOnInit(): void {
    //Timer API
    this.clock = interval(1000).pipe(
      switchMap(() => this.studentService.getCurrentTime()),
      map((response: any) => new Date(response.datetime))
    );

    //Timer API ---> get formattedDate
    const datePipe = new DatePipe('en-US');
    this.clock.subscribe((date: Date) => {
      this.formattedDate = datePipe.transform(date, 'EEEE, MMMM d');
    });

    //Student Attendance API
    this.getStudentAttendance();    
  }

  public getStudentAttendance(){
    this.studentService.getTodayAttendance(this.loginService.getStudentId()).subscribe({  
      next: (data: any) => {
          this.attendance = data.Attendance;
          localStorage.setItem('attendance', JSON.stringify(this.attendance));
          if(this.attendance.checkInTime != null){
            this.formattedCheckInTime = this.changeTimeFormat(this.attendance.checkInTime);
          }
          if(this.attendance.checkOutTime != null){
            this.formattedCheckOutTime = this.changeTimeFormat(this.attendance.checkOutTime);
          }
          
          const checkInTime: moment.Moment = moment(this.attendance.checkInTime, 'HH:mm:ss');
          if(this.attendance.checkOutTime != null){
          const checkOutTime: moment.Moment = moment(this.attendance.checkOutTime, 'HH:mm:ss');
          const duration: moment.Duration = moment.duration(checkOutTime.diff(checkInTime));
          this.timer=duration.asSeconds();
          this.totalHrs = new Date(this.timer * 1000).toISOString().substr(11, 8);
          }else{
            const currentTime:moment.Moment = moment(new Date(),'HH:mm:ss');
            const duration: moment.Duration = moment.duration(currentTime.diff(checkInTime));
            this.timer=duration.asSeconds();
            this.startTimer();
          }
      },
    });
  }

  public startTimer() {
     {
      this.interval = setInterval(() => {
        this.timer++;
        this.totalHrs = new Date(this.timer * 1000).toISOString().substr(11, 8);
      }, 1000);
    }
  }

  public isCheckedIn() {
    if (this.attendance.checkOutTime == undefined || this.attendance.checkInTime != undefined)
      return true;
    return false;
  }

  public changeTimeFormat(time:any){
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }
}
