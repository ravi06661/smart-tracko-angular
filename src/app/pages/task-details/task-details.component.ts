import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { clear } from 'console';
import { uniqueDates } from 'igniteui-angular/lib/core/utils';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Task } from 'src/app/entity/task';
import { LoginService } from 'src/app/service/login.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentImages/'
  imageUrl = this.BASE_URL + '/file/getImageApi/taskAndAssignmentImages/';

  taskId: number = 0;
  task = new Task
  taskSubmittion: StudentTaskSubmittion = new StudentTaskSubmittion();
  //message: string = ''
  submissionForm: FormGroup;
  isSubmittedTask: boolean = false
  taskAttachment: boolean = false
  constructor(private taskService: TaskServiceService,
    private router: ActivatedRoute,
    private utilityService: UtilityServiceService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toast: ToastService) {
    this.submissionForm = this.formBuilder.group({
      file: ['', Validators.required],
      taskDescription: ['', Validators.required]
    });
    this.taskId = this.router.snapshot.params[('id')]
  }

  ngOnInit() {
    this.getTask();
  }
  public getTask() {
    this.taskService.getTaskById(this.taskId).subscribe(
      (data: any) => {
        this.task = data.task;
        if (data.attachment)
          this.taskAttachment = true
        this.isSubmitted()
      }
    )
  }

  public submitTask() {

    if (this.task.attachmentStatus == "Optional" || this.task.attachmentStatus == "Not Allowed") {
      const taskDescriptionValue = this.submissionForm.get('taskDescription')!.value;
      if (taskDescriptionValue == '') {
        this.submissionFormFun()
        return
      }
      this.taskSubmittion.studentId = this.loginService.getStudentId();
      this.taskService.submitTask(this.taskSubmittion, this.taskId).subscribe(
        {
          next: (data) => {
            this.taskSubmittion = new StudentTaskSubmittion
            this.submissionForm.reset()
            AppUtils.modelDismiss('close-task-submission-form')
            this.isSubmittedTask = false
            this.toast.showSuccess('Task successfully submitted', 'Success')

          },
          error: (er: any) => {
            this.toast.showError(er.error.message, 'Error')
          }
        }
      )
    } else {
      if (this.submissionForm.invalid) {
        this.submissionFormFun()
      } else {
        this.taskSubmittion.studentId = this.loginService.getStudentId();
        this.taskService.submitTask(this.taskSubmittion, this.taskId).subscribe(
          {
            next: (data) => {
              this.taskSubmittion = new StudentTaskSubmittion
              this.submissionForm.reset()
              this.isSubmittedTask = false
              AppUtils.modelDismiss('close-task-submission-form')
              this.toast.showSuccess('Task successfully submitted', 'Success')
            },
            error: (er) => {
              this.toast.showError(er.error.message, 'Error')
            }
          }
        )
      }
    }


  }


  public setImage(event: any) {
    this.taskSubmittion.submittionFileName = event.target.files[0];
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

  public isSubmitted() {
    this.taskService.isSubmitted(this.task.taskId, this.loginService.getStudentId()).subscribe(
      (data: any) => {
        if (data == true)
          this.isSubmittedTask = false
        else
          this.isSubmittedTask = true
      }
    )
  }
  public deleteFile() {
    this.taskSubmittion.submittionFileName != null ? File : File
  }
}

