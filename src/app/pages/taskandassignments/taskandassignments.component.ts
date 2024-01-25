import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { LoginService } from 'src/app/service/login.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-taskandassignments',
  templateUrl: './taskandassignments.component.html',
  styleUrls: ['./taskandassignments.component.scss']
})
export class TaskandassignmentsComponent implements OnInit {

  BASE_URL = this.utilityService.getBaseUrl();
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentImages/'
  //assignments: Assignment[] = []
  unLockAssignments: any
  lockAssignments: any
  assignmentSubmissionsList: AssignmentSubmission[] = []
  assignmentSubmissionsList2: AssignmentSubmission[] = []
  unLockAssignment: Assignment = new Assignment
  assignmentSubmissionObj: AssignmentSubmission = new AssignmentSubmission
  assignmentId: number = 0;
  assignmentTaskVisibility: boolean[] = [];
  assignmentCount: number = 0;
  todayDate: Date = new Date()
  constructor(
    private datePipe: DatePipe,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private loginService: LoginService,
    private utilityService: UtilityServiceService) {
    this.lockAssignments = []
    this.unLockAssignments = 0
    this.getSubmitedAssignment();
  }

  ngOnInit(): void {
    this.getAllAssignments();
  }

  public getAllAssignments() {
    this.assignmentService.getAllLockedAndUnlockedAssignment(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        this.assignmentCount = this.unLockAssignments.length
        this.lockAssignments = Array(data.lockedAssignment).fill(0).map((x, i) => i);
        this.unLockAssignments.forEach(() => {
          this.assignmentTaskVisibility.push(false);
        });
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

  public getSubmitedAssignment() {
    this.assignmentService.getSubmitedAssignmetByStudentId(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.assignmentSubmissionsList = data
        this.assignmentSubmissionsList2 = data
      }
    })
  }

  public changeTimeFormat(date: any) {
    return moment(date, "YYYY-MM-dd HH:mm:ss").format("hh:mm A");
  }

  public getAssignment(id: number) {
    this.assignmentId = id;
    this.unLockAssignment = this.unLockAssignments.find((assignment: any) => assignment.id === id) as Assignment;
  }
  toggleAssignment(index: number): void {
    this.assignmentTaskVisibility[index] = !this.assignmentTaskVisibility[index];
  }

  progressWidth: string = '';

  public calculatePercentages(num1: number, num2: number) {
    return (num2 == 0 )? 0 : Math.floor(num1 / num2 * 100)
  }

  public getSubmissionAssignmentFilterByStatus(status: string) {

    this.assignmentSubmissionsList2 = this.assignmentSubmissionsList
    this.assignmentSubmissionsList2 = this.assignmentSubmissionsList2.filter(obj => {
      return (obj.status == status) ? obj : null;
    });
  }

  public dateFormatter(date: Date) {
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }
}
