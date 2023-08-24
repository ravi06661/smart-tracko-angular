import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentServiceService } from 'src/app/service/assignment.service';

@Component({
  selector: 'app-admin-create-assignments',
  templateUrl: './admin-create-assignments.component.html',
  styleUrls: ['./admin-create-assignments.component.scss']
})
export class AdminCreateAssignmentsComponent implements OnInit {

  assignmentId = 0;
  public Editor = ClassicEditor;
  assignment:Assignment = new Assignment
  constructor(private activateRoute:ActivatedRoute,
              private assignmentService:AssignmentServiceService){}

  ngOnInit(): void {
    this.assignmentId = this.activateRoute.snapshot.params['id'];
  }

  public getAssignmentById(){
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next:(data:any)=>{
        this.assignment = data
      }
    })
  }

  public addTaskInAssingments(){

  }

}
