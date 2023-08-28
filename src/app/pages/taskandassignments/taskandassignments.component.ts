import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentServiceService } from 'src/app/service/assignment.service';

@Component({
  selector: 'app-taskandassignments',
  templateUrl: './taskandassignments.component.html',
  styleUrls: ['./taskandassignments.component.scss']
})
export class TaskandassignmentsComponent implements OnInit {

  assignments:Assignment [] = []
  unLockAssignments:Assignment =  new Assignment
  lockAssignments:Assignment [] = []

  constructor(private assignmentService:AssignmentServiceService){}

  ngOnInit(): void {
   this.getAllAssignments()
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

}
