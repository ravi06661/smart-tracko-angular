import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-assignment-submission',
  templateUrl: './admin-assignment-submission.component.html',
  styleUrls: ['./admin-assignment-submission.component.scss']
})
export class AdminAssignmentSubmissionComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  IMG_URL = this.BASE_URL + '/file/getImageApi/images/'
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentImages/'
  submitedAssignment: any
  review = '';
  status = 'Unreviewed';
  submissionId!: number
  assginmentId: any;
  constructor(private activateRoute: ActivatedRoute,
    private utilityService: UtilityServiceService,
    private assignmentService: AssignmentServiceService) {

    this.activateRoute.queryParams.subscribe(params => {
      this.submissionId = params['submissionId'];
    });
  }

  ngOnInit(): void {
    this.getSubmission()
  }

  getSubmission() {
    this.assignmentService.getSubmittedAssignmentBySubmissionId(this.submissionId).subscribe({
      next: (data: any) => {
        this.submitedAssignment = data
      },
      error: (er: any) => {
        console.log(er.error);
      }
    })
    if (this.submitedAssignment.status == this.status) {
      this.updateSubmitAssignmentStatus('Reviewing');
    }
  }


  public updateSubmitAssignmentStatus(status: string) {
    this.assignmentService.updateSubmitAssignmentStatus(this.submissionId, status, this.review).subscribe({
      next: (data: any) => {
        this.submitedAssignment = data
      }
    })
  }

}
