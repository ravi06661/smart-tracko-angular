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
  unLockAssignment: Assignment = new Assignment
  assignmentSubmissionObj: AssignmentSubmission = new AssignmentSubmission
  assignmentId: number = 0;
  constructor(private assignmentService: AssignmentServiceService,
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
    this.assignmentService.getAllLockedAndUnlockedAssignment().subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        console.log(this.unLockAssignments);
        this.lockAssignments = data.lockedAssignment;
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
  assignmentTaskVisibility: boolean[] = [];
 
  toggleAssignment(index: number): void {
    // Toggle the visibility of assignment tasks for the selected assignment
    this.assignmentTaskVisibility[index] = !this.assignmentTaskVisibility[index];
  }
}
