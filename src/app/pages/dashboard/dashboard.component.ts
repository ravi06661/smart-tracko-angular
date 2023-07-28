import { DatePipe, LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, interval, map, switchMap } from 'rxjs';
import { Assignment } from 'src/app/entity/assignment';
import { Attendance } from 'src/app/entity/attendance';

import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/File/getImageApi/workReport/';


  check: boolean = false;
  assignment: Assignment = new Assignment()
  constructor(private service: AssignmentServiceService,
    private utilityService:UtilityServiceService,
    private loginService:LoginService,
    private localst:LocationStrategy,private studentService: StudentService) { }

  ngOnInit(): void {
    this.preventBackButton();

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

  }
  
  test() {
    this.service.getAssignment(192).subscribe(
      (data:any) => {
        this.assignment = data
        console.log(this.assignment)
      }
    )
  }

  public preventBackButton(){
    history.pushState(null,'',location.href);
    this.localst.onPopState(()=>{
      history.pushState(null,'',location.href);
    });
  }
  
}
