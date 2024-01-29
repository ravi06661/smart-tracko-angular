import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { group } from 'console';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentQuestionRequest } from 'src/app/payload/assignment-question-request';
import { TaskQuestionRequest } from 'src/app/payload/task-question-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
  selector: 'app-admin-create-assignments',
  templateUrl: './admin-create-assignments.component.html',
  styleUrls: ['./admin-create-assignments.component.scss'],
})
export class AdminCreateAssignmentsComponent implements OnInit {
  assignmentId = 0;
  public Editor = ClassicEditor;
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/taskAndAssignmentImages/';
  assignment: Assignment = new Assignment();
  assignmentQuestionsData: AssignmentQuestionRequest = new AssignmentQuestionRequest();
  taskQuestion: TaskQuestionRequest = new TaskQuestionRequest();
  imagePreview: string[] = [];
  imageName: string[] = [];
  newImg = '';
  attachmentInfo = {
    name: '',
    size: 0
  };
  expandedQuestions: boolean[] = [];
  questionId: number = 0;
  assignmentForm: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastService
  ) {

    this.assignmentForm = this.formBuilder.group({
      question: ['', Validators.required]
    })

  }

  ngOnInit(): void {
    this.assignmentId = this.activateRoute.snapshot.params['id'];
    this.assignmentQuestionsData.assignmentId = this.assignmentId;
    this.getAssignmentById();
  }

  isFieldInvalidForAssignmentForm(fieldName: string): boolean {
    const field = this.assignmentForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public taskFormControl() {
    Object.keys(this.assignmentForm.controls).forEach(key => {
      const control = this.assignmentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public getAssignmentById() {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (data: any) => {
        this.assignment = data.assignment;
        this.assignmentQuestionsData.assignmentQuestion = data.assignment.assignmentQuestion
      },
    });
  }

  public addImageFile(event: any) {
    this.taskQuestion.questionImages.push(event.target.files[0]);
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.push(e.target.result);
        this.imageName.push(selectedFile.name);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      this.imagePreview.push('');
      this.imageName.push('');
    }
  }
  url: string = '';

  public addAssignmentQuestion() {
    this.assignmentService.addQuestionInTask(this.taskQuestion, this.assignmentId).subscribe(
      {
        next: (data: any) => {
          this.assignmentQuestionsData.assignmentQuestion.push(data)
          this.expandedQuestions.push(false)
          this.assignmentForm.reset()
          this.toast.showSuccess('Question added successsfully!!', 'Success');
        },
        error: (er: any) => {
          this.toast.showError(er.error.message, 'Error')
        }
      }
    )
    this.taskQuestion = new TaskQuestionRequest();
    this.imagePreview = [];
    this.imageName = [];
  }
  public addAttachmentFile(event: any) {
    const data = event.target.files[0];
    this.attachmentInfo.name = event.target.files[0].name
    this.attachmentInfo.size = Math.floor(((event.target.files[0].size) / 1024) / 1024)
    this.assignmentQuestionsData.taskAttachment = event.target.files[0];
  }

  deleteAttachment() {
    //const data = event.target.files[0];
    this.attachmentInfo.name = ''
    this.attachmentInfo.size = 0
    this.assignmentQuestionsData.taskAttachment = undefined
  }

  public submitAssignmentQuestions() {

    if (this.assignmentQuestionsData.assignmentQuestion.length === 0 && this.assignmentForm.invalid) {
      this.taskFormControl();
      return;
    } else {
      let obj = {
        ...this.assignment,
        attachment: this.assignmentQuestionsData.taskAttachment
      }
      this.assignmentService.addAssignment(obj)
        .subscribe({
          next: (data: any) => {
            this.router.navigate(['/admin/assignments']);
          }
        })
    }
  }

  public deleteAssignmentQuestion() {
    this.assignmentService.deleteTaskQuestion(this.questionId).subscribe(
      {
        next: (data) => {
          AppUtils.modelDismiss('delete-assignment-modal')
          this.toast.showSuccess('Successfully deleted!!', 'Success')
          let index = this.assignmentQuestionsData.assignmentQuestion.findIndex(obj => obj.questionId == this.questionId) as number
          this.assignmentQuestionsData.assignmentQuestion.splice(index, 1)
        },
        error: (er: any) => {
          this.toast.showError(er.error.message, 'Error')
        }
      }
    )
  }

  setQuestionId(id: number) {
    this.questionId = id;
  }

  toggleQuestion(index: number) {
    this.expandedQuestions[index] = !this.expandedQuestions[index];
  }

  public deleteImage(index: number) {
    if (index >= 0 && index < this.taskQuestion.questionImages.length) {
      this.taskQuestion.questionImages.splice(index, 1);
      this.imagePreview.splice(index, 1);
      this.imageName.splice(index, 1);
    }
  }

  public pageRenderUsingRouterLink(path: string, questionId: number) {
    const dataParams = {
      id: questionId,
      type:"assignmentQuestion"
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

}
