import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskQuestion } from 'src/app/entity/task-question';
import { AssignmentSubmissionRequest } from 'src/app/payload/assignment-submission-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { LoginService } from 'src/app/service/login.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss']
})
export class AssignmentDetailsComponent implements OnInit {

  BASE_URL = this.utilityService.getBaseUrl();
  IMG_URL = this.BASE_URL + '/file/getImageApi/taskAndAssignmentImages/'
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentAttachment/'
  questionId = 0;
  assignmentId = 0;
  assignmentQues: TaskQuestion = new TaskQuestion;
  attachment = '';
  file: any
  isSubmittedQuestion: boolean = false
  assignmentSubmission: AssignmentSubmissionRequest = new AssignmentSubmissionRequest
  submissionForm: FormGroup;
  constructor(private activateRoute: ActivatedRoute,
    private assignmentService: AssignmentServiceService,
    private utilityService: UtilityServiceService,
    private loginService: LoginService,
    private router: Router
    , private formBuilder: FormBuilder,
    private toast: ToastService) {

    this.submissionForm = this.formBuilder.group({
      file: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.activateRoute.queryParams.subscribe(params => {
      this.questionId = params['questionId'];
      this.assignmentId = params['assignmentId'];
    });
    this.isSubmitted()
  }

  ngOnInit(): void {
    this.getAssignmentQuestionById();

  }
  loading: boolean = true;

  onVideoLoad() {
    this.loading = false;
  }

  public getAssignmentQuestionById() {

    this.assignmentService.getAssignmentQuestionById(this.questionId).subscribe({
      next: (data: any) => {
        this.assignmentQues = data.question
        this.attachment = data.attachment
      }
    })
  }

  public addSubmitFile(event: any) {
    this.file = event.target.files[0]
  }

  public submitAssignment() {
    if (this.submissionForm.invalid) {
      this.submissionFormFun()
      return;
    }
    this.assignmentSubmission.studentId = this.loginService.getStudentId();
    this.assignmentSubmission.assignmentId = this.assignmentId
    this.assignmentSubmission.taskId = this.questionId

    this.assignmentService.submitAssignment(this.assignmentSubmission, this.file).subscribe({
      next: (data) => {
        this.toast.showSuccess('Successfully submitted!!', 'Success')
        this.router.navigate(['/student/taskAndAssignment'])
      }
    })
  }

  public isSubmitted() {
    this.assignmentService.isSubmitted(this.questionId, this.loginService.getStudentId()).subscribe(
      (data: any) => {
        if (data.status) {
          this.isSubmittedQuestion = false;
        } else
          this.isSubmittedQuestion = true;
      }, (er: any) => {
        this.toast.showError(er.error.message, 'Error')
      }
    )
  }

  isImageExpanded = false;

  toggleImageSize(event: Event) {
    const image = event.target as HTMLImageElement;
    this.isImageExpanded = !this.isImageExpanded;

    if (this.isImageExpanded) {
      image.classList.add('expanded');
    } else {
      image.classList.remove('expanded');
    }
  }

  public clearForm() {
    this.submissionForm.reset()
  }
  public isFieldInvalidForSubmissionForm(fieldName: string): boolean {
    const field = this.submissionForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public submissionFormFun() {
    Object.keys(this.submissionForm.controls).forEach(key => {
      const control = this.submissionForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
