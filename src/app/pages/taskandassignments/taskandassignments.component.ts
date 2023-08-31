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
  ATTACHMENT_URL = this.BASE_URL+'/file/download/taskAndAssignmentAttachment/'
  assignments:Assignment [] = []
  unLockAssignments:Assignment =  new Assignment
  lockAssignments:Assignment [] = []
  assignmentSubmissionsList:AssignmentSubmission[] = []
  assignmentSubmissionObj:AssignmentSubmission = new AssignmentSubmission

  constructor(private assignmentService:AssignmentServiceService,
              private router:Router,
              private loginService:LoginService,
              private utilityService:UtilityServiceService){}

  ngOnInit(): void {
   this.getAllAssignments();
   this.getSubmitedAssignment();
  }

  public getAllAssignments(){
    this.assignmentService.getAllAssignments().subscribe({
      next:(data:any)=>{
        this.unLockAssignments = data[0];
        this.assignments = data
        this.lockAssignments = this.assignments.filter(e=> e.id != this.unLockAssignments.id)  
      }
    })
  }

  public pageRenderUsingRouterLink(path:string,questionId:number){
    const dataParams = {
      assignmentId: this.unLockAssignments.id,
      questionId: questionId,
    };
    this.router.navigate([path],{
      queryParams: dataParams
    });
  }


  public getSubmitedAssignment(){
    this.assignmentService.getSubmitedAssignmetByStudentId(this.loginService.getStudentId()).subscribe({
      next:(data:any)=>{
        this.assignmentSubmissionsList = data
      }
    })
  }

  public changeTimeFormat(date:any){
    return moment(date, "YYYY-MM-dd HH:mm:ss").format("hh:mm A");
  }

}
