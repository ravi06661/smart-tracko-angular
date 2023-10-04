import { DatePipe, LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, interval, map, switchMap } from 'rxjs';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { Attendance } from 'src/app/entity/attendance';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Task } from 'src/app/entity/task';

import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
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
  formattedCheckInTime: any
  formattedCheckOutTime: any

  tasks: Task[] = []

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/workReport/';


  check: boolean = false;
  assignment: Assignment = new Assignment()
  taskSubmissionList: StudentTaskSubmittion[] = []
  assignmentSubmissionsList: AssignmentSubmission[] = []
  assignmentSubmissionObj: AssignmentSubmission = new AssignmentSubmission
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentAttachment/'
  taskSubmissionObj: StudentTaskSubmittion = new StudentTaskSubmittion
  toDoAssignment: Assignment = new Assignment
  unLockAssignments: Assignment[] = []
  lockAssignments: Assignment[] = []
  assignmentId: any;

  totalTask: number = 0;
  totalAssignment: number = 0;
  totalTaskSubmitted: number = 0;
  totalAssignmnetSubmitted: number = 0;


  toDoAssignmentLength = 0;
  tasksLength = 0;

  todayDate: Date = new Date()


  constructor(private service: AssignmentServiceService,
    private utilityService: UtilityServiceService,
    private loginService: LoginService,
    private localst: LocationStrategy, private studentService: StudentService,
    private taskService: TaskServiceService, private assignmentService: AssignmentServiceService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.getAllTask();
    this.preventBackButton();
    this.getSubmitedTaskByStudent();
    this.getSubmitedAssignment();
    this.getdoAssignment()
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

  public getStudentAttendance() {
    this.studentService.getTodayAttendance(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.attendance = data.Attendance;
        if (this.attendance.checkInTime != null) {
          this.formattedCheckInTime = this.changeTimeFormat(this.attendance.checkInTime);
        }
        if (this.attendance.checkOutTime != null) {
          this.formattedCheckOutTime = this.changeTimeFormat(this.attendance.checkOutTime);
        }

        const checkInTime: moment.Moment = moment(this.attendance.checkInTime, 'HH:mm:ss');
        if (this.attendance.checkOutTime != null) {
          const checkOutTime: moment.Moment = moment(this.attendance.checkOutTime, 'HH:mm:ss');
          const duration: moment.Duration = moment.duration(checkOutTime.diff(checkInTime));
          this.timer = duration.asSeconds();
          this.totalHrs = new Date(this.timer * 1000).toISOString().substr(11, 8);
        } else {
          const currentTime: moment.Moment = moment(new Date(), 'HH:mm:ss');
          const duration: moment.Duration = moment.duration(currentTime.diff(checkInTime));
          this.timer = duration.asSeconds();
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

  public preventBackButton() {
    history.pushState(null, '', location.href);
    this.localst.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }


  public changeTimeFormat(time: any) {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }

  public getAllTask() {
    this.taskService.getAllTask(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.tasks = data
        this.totalTask = this.tasks.length
        this.tasksLength = this.tasks.length;
      }
    )
  }

  public getSubmitedTaskByStudent() {
    this.taskService.getSubmitedTaskByStudent(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.taskSubmissionList = data
        this.totalTaskSubmitted = this.taskSubmissionList.length
      }
    })
  }
  public getSubmitedAssignment() {
    this.assignmentService.getSubmitedAssignmetByStudentId(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.assignmentSubmissionsList = data
        this.totalAssignmnetSubmitted = this.assignmentSubmissionsList.length
      }
    })
  }

  public getdoAssignment() {
    this.assignmentService.getAllLockedAndUnlockedAssignment(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        this.toDoAssignment = this.unLockAssignments[this.unLockAssignments.length - 1];
        this.assignmentId = this.toDoAssignment.id
        this.lockAssignments = data.lockedAssignment;
        this.toDoAssignmentLength = this.toDoAssignment.assignmentQuestion.length
      }
    )
  }
  public pageRenderUsingRouterLink(path: string, questionId: number) {
    const dataParams = {
      assignmentId: this.assignmentId,
      questionId: questionId,
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

  submissionUpdates: string = "Assignment Updates";
  submissionUpdates1: string = "Task Upates";
  taskSubmissionIsActive: boolean = false;
  AssignmentsSubmissionIsactive: boolean = true;

  updates() {
    if (this.submissionUpdates == "Assignment Updates") {
      this.submissionUpdates1 = this.submissionUpdates
      this.submissionUpdates = "Task Upates"
      this.AssignmentsSubmissionIsactive = false;
      this.taskSubmissionIsActive = true;
    } else if (this.submissionUpdates == "Task Upates") {
      this.submissionUpdates1 = this.submissionUpdates
      this.submissionUpdates = "Assignment Updates"
      this.AssignmentsSubmissionIsactive = true;
      this.taskSubmissionIsActive = false;
    }
  }

  public dateFormatter(date:Date){
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }
}

