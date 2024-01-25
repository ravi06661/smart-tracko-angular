import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TaskQuestion } from 'src/app/entity/task-question';
import { TaskQuestionRequest } from 'src/app/payload/task-question-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-edit-task',
  templateUrl: './admin-edit-task.component.html',
  styleUrls: ['./admin-edit-task.component.scss']
})
export class AdminEditTaskComponent implements OnInit {

  question = new TaskQuestion()
  message!: string
  imagePreview: string[] = [];
  imageName: string[] = []
  updatingImages: File[] = []
  temp = new TaskQuestion()
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/taskAndAssignmentImages/';
  public Editor = ClassicEditor;

  constructor(public utilityService: UtilityServiceService, private router: Router, private taskService: TaskServiceService, private activateRoute: ActivatedRoute, private assignmentService: AssignmentServiceService) {
    this.taskId = this.activateRoute.snapshot.params[('id')]
  }
  taskId!: number;
  ngOnInit(): void {

    this.getTask(this.taskId);
  }
  public getTask(id: any) {
    this.assignmentService.getAssignmentQuestionById(id).subscribe({
      next: (data: any) => {
        this.question = data.question;
        this.temp = data.question;
      },
      error: (er: any) => {
        this.message = er.error.message
      }
    })
  }

  public deleteFromQuestion(index: number) {
    if (index >= 0 && index < this.question.questionImages.length) {
      this.question.questionImages.splice(index, 1);
      this.imagePreview.splice(index, 1);
      this.imageName.splice(index, 1);
    }
  }
  public deleteFromLocal(index: number) {
    this.imagePreview.splice(index, 1);
    this.imageName.splice(index, 1);
    this.updatingImages.splice(index, 1)
  }

  public addImageFile(event: any) {
    const selectedFile = event.target.files[0];
    this.updatingImages.push(event.target.files[0])
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

  public updateQuestion() {
    this.assignmentService.updateQuestion(this.question, this.updatingImages).subscribe({
      next: (data: any) => {
        this.updatingImages = []
        this.question = data.question;
        this.temp = data.question;
        alert('success')
      },
      error: (er: any) => {
        console.log(er.error.message);
      }
    })
  }

  public discardChanges() {
    this.question = this.temp
  }
}
