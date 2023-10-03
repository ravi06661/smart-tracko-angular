import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { group } from 'console';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentQuestionRequest } from 'src/app/payload/assignment-question-request';
import { TaskQuestionRequest } from 'src/app/payload/task-question-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

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
  assignmentForm:FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder:FormBuilder
  ) {

    this.assignmentForm = this.formBuilder.group({
      question : ['',Validators.required]
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
        this.assignment = data;
        this.assignmentQuestionsData.assignmentQuestion = data.assignmentQuestion
      },
    });
  }

  public addImageFile(event: any) {
    console.log(event);
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
  
  public addTaskQuestion() {
    this.assignmentService.addQuestionInTask(this.taskQuestion, this.assignmentId).subscribe(
      (data: any) => {
        this.assignmentQuestionsData.assignmentQuestion = data.assignmentQuestion
        this.assignmentQuestionsData.assignmentQuestion.forEach(() => this.expandedQuestions.push(false));
      }, (errore) => {
        // alert('hi')
        this.assignmentQuestionsData.assignmentQuestion = errore.assignmentQuestion
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

  public submitAssignmentQuestions() {
    this.taskFormControl();
    if(this.assignmentForm.invalid){
      return;
    }

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
  // imageUrll: any
  // public showImage(file: any) {
  //   return 'assets/images/temp_img/modal.png';
  // }
  // public imageUrl(file: any): void {
  // }

  public deleteAssignmentQuestion() {
    this.assignmentService.deleteTaskQuestion(this.assignmentId, this.questionId).subscribe(
      (data) => {
        alert('Success..')
        this.getAssignmentById();
      }
    )
  }

  setQuestionId(id: number) {
    console.log(id);
    this.questionId = id;
  }

  toggleQuestion(index: number) {
    this.expandedQuestions[index] = !this.expandedQuestions[index];
  }

  public deleteImage(index:number){
    if (index >= 0 && index < this.taskQuestion.questionImages.length) {
      this.taskQuestion.questionImages.splice(index, 1);
      this.imagePreview.splice(index,1);
      this.imageName.splice(index,1);
    }
    console.log(this.taskQuestion.questionImages);
    
  }
}
