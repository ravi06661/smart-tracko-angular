import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
declare let Swiper: any;
@Component({
  selector: 'app-admin-assignment-submission',
  templateUrl: './admin-assignment-submission.component.html',
  styleUrls: ['./admin-assignment-submission.component.scss']
})
export class AdminAssignmentSubmissionComponent implements OnInit {

  submitedAssignment: AssignmentSubmission[] = []

  review = '';
  status = 'Unreviewed';
  submissionId!: number
  assignmentId: any;
  index: number = 0

  constructor(private activateRoute: ActivatedRoute,
    private assignmentService: AssignmentServiceService) {

    this.activateRoute.queryParams.subscribe(params => {
      this.submissionId = params['submissionId'];
      this.assignmentId = params['assignmentId'];
    });
  }

  ngOnInit(): void {
    // this.getSubmission()
    this.getAllSubmittedAssignmentTask();
  }
  // getSubmission() {
  //   this.assignmentService.getSubmittedAssignmentBySubmissionId(this.submissionId).subscribe({
  //     next: (data: any) => {
  //       this.submitedAssignment = data
  //     },
  //     error: (er: any) => {
  //       console.log(er.error);
  //     }
  //   })

  //   // if (this.submitedAssignment.status == this.status) {
  //   //   this.updateSubmitAssignmentStatus('Reviewing');
  //   // }

  // }

  public updateSubmitAssignmentStatus(status: string) {
    this.assignmentService.updateSubmitAssignmentStatus(this.submissionId, status, this.review).subscribe({
      next: (data: any) => {
        if(status!='Reviewing'){
          this.removeTaskFromList()
        }
      }
    })
  }
  ngAfterViewInit() {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      loop: true,
      grabCursor: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".next",
        prevEl: ".prev"
      },
    });
  }

  removeTaskFromList() {
    this.submitedAssignment.splice(this.index, 1)
  }
  getAllSubmittedAssignmentTask() {

    this.assignmentService.getAllSubmittedAssignmentTask(this.assignmentId).subscribe({
      next: (data: any) => {
        this.submitedAssignment = data;
        let res = this.submitedAssignment.find(obj => obj.submissionId == this.submissionId) as AssignmentSubmission
        this.updateSubmitAssignmentStatus('Reviewing')
      },
      error: (er: any) => {
        console.log(er.error.message);
      }
    })
  }
}
