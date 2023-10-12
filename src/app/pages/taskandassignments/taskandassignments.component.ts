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
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentAttachment/'
  assignments: Assignment[] = []
  unLockAssignments: Assignment[] = []
  lockAssignments: Assignment[] = []
  assignmentSubmissionsList: AssignmentSubmission[] = []
  assignmentSubmissionsList2: AssignmentSubmission[] = []
  unLockAssignment: Assignment = new Assignment
  assignmentSubmissionObj: AssignmentSubmission = new AssignmentSubmission
  assignmentId: number = 0;
  assignmentTaskVisibility: boolean[] = [];
  assignmentCount: number = 0;
  todayDate:Date = new Date()
  constructor(
    private datePipe: DatePipe,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private loginService: LoginService,
    private utilityService: UtilityServiceService) {
    this.unLockAssignments.forEach(() => {
      this.assignmentTaskVisibility.push(false);
    });
  }

  ngOnInit(): void {
    this.getAllAssignments();
    this.getSubmitedAssignment();
  }

  public getAllAssignments() {
    this.assignmentService.getAllLockedAndUnlockedAssignment(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        this.assignmentCount = this.unLockAssignments.length
        this.lockAssignments = data.lockedAssignment;
        this.temp();
        console.log(this.unLockAssignment);
        
      }
    )
  }
  //for counting total  completed assignment task
  AssignMap = new Map<number, number>();
  public temp() {
    let count: number = 0;
    this.unLockAssignments.forEach(element => {
      element.assignmentQuestion.forEach(e => {
        if (this.assignmentSubmissionsList.find(e1 => e1.taskId === e.questionId)) {
          count += 1;
        }
      })
      this.AssignMap.set(element.id, count);
      count = 0;
    });
  }
  public getTotalCompletedAssignmentCount(id: number) {
    return this.AssignMap.get(id);
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
    this.unLockAssignment = this.unLockAssignments.find(assignment => assignment.id === id) as Assignment;
  }
  toggleAssignment(index: number): void {
    this.assignmentTaskVisibility[index] = !this.assignmentTaskVisibility[index];
  }

  progressWidth: string = '';
  // calculatePercentages(num1: number, num2: number) {
  //   let per = Math.floor(num1 / num2 * 100);
  //   let obj = per * (7.05);
  //   this.progressWidth = obj.toString() + 'px'
  //   return per
  // }
  public calculatePercentages(num1: number, num2: number) {
    let totalCompleted = this.getTotalCompletedAssignmentCount(num1);
    let per

      per = Math.floor( totalCompleted! / num2 * 100);
      if(num2==0){
        per=0
      }
    
    return per;
  }

  public getSubmissionAssignmentFilterByStatus(status: string) {
    this.assignmentSubmissionsList2 = this.assignmentSubmissionsList
    this.assignmentSubmissionsList2 = this.assignmentSubmissionsList2.filter(obj => {
      if (obj.status == status) {
        return obj
      } else
        return null;
    });
  }

  public dateFormatter(date:Date){
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }
}
