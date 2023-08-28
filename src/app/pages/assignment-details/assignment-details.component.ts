import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentServiceService } from 'src/app/service/assignment.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss']
})
export class AssignmentDetailsComponent implements OnInit {

  questionId = 0; 

  constructor(private activateRoute:ActivatedRoute,
              private assignmentService:AssignmentServiceService){}

  ngOnInit(): void {
    this.questionId = this.activateRoute.snapshot.params['id']
  }

  public getAssignmentQuestionById(){
    this.assignmentService.getAssignmentQuestionById(this.questionId).subscribe({

    })
  }

  
}
