import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { an } from '@fullcalendar/core/internal-common';
import { log } from 'console';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { Task } from 'src/app/entity/task';
import { TaskQuestion } from 'src/app/entity/task-question';
import { AssignmentQuestionRequest } from 'src/app/payload/assignment-question-request';
import { TaskQuestionRequest } from 'src/app/payload/task-question-request';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-create-task',
  templateUrl: './admin-create-task.component.html',
  styleUrls: ['./admin-create-task.component.scss']
})
export class AdminCreateTaskComponent {
  task: TaskRequest = new TaskRequest()
  subjects: Subject[] = []
  courses: Course[] = []
  taskId: number = 0;
  question: TaskQuestion = new TaskQuestion()
  public Editor = ClassicEditor;


  taskData: Task = new Task
  taskQuestion: TaskQuestionRequest = new TaskQuestionRequest();
  imagePreview: string[] = [];
  imageName: string[] = [];
  newImg = '';
  attachmentInfo = {
    name: '',
    size: 0
  };
  questionId: number = 0;
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/taskAndAssignmentImages/';

  secondTaskForm: FormGroup;
  constructor(private activateRouter: ActivatedRoute,
    private subjectService: SubjectService,
    private courseService: CourseServiceService,
    private taskService: TaskServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder) {


    this.secondTaskForm = this.formBuilder.group({
      question: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.taskId = this.activateRouter.snapshot.params[('id')]
    this.getTask()
  }


  isFieldInvalidForSecondTaskForm(fieldName: string): boolean {
    const field = this.secondTaskForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public secondFormControl() {
    Object.keys(this.secondTaskForm.controls).forEach(key => {
      const control = this.secondTaskForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public getTask() {
    this.taskService.getTaskById(this.taskId).subscribe(
      (data: any) => {
        this.task = data;
        this.taskData.taskQuestion = data.taskQuestion;
        this.taskData.taskQuestion.forEach(() => this.expandedQuestions.push(false));
      }
    )
  }

  public getCourses() {
    this.courseService.getAllCourses(0, 100).subscribe(
      (data: any) => {
        this.courses = data.response
      }
    )
  }
  public getSubjects() {
    this.subjects = this.task.course.subjects
  }

  public deleteTaskQuestion() {
    this.taskService.deleteTaskQuestion(this.questionId).subscribe(
      (data) => {
        alert('Success..')
        this.getTask();
      }
    )
  }

  setQuestionId(id: number) {
    this.questionId = id;
  }

  public addAttachmentFile(event: any) {
    const data = event.target.files[0];
    this.attachmentInfo.name = event.target.files[0].name
    this.attachmentInfo.size = Math.floor(((event.target.files[0].size) / 1024) / 1024)
    this.taskData.taskAttachment = event.target.files[0];
  }

  public addTaskQuestion() {
    if (this.secondTaskForm.invalid) {
      this.secondFormControl()
      return;
    } else {
      this.taskService.addQuestionInTask(this.taskQuestion, this.taskId).subscribe(
        {
          next: (data: any) => {
            this.taskData.taskQuestion = data.taskQuestion
            this.secondTaskForm = this.formBuilder.group({
              question: ['', Validators.required]
            })
          },
          error: (errore) => {
            alert('Error')
          }
        }
      )
      this.taskQuestion = new TaskQuestionRequest();
      this.imagePreview = [];
      this.imageName = [];
    }
  }

  public submitTask() {
    if (this.taskData.taskQuestion.length !== 0) {
      this.taskData.taskId = this.taskId
      this.taskService.addAssignment(this.taskData)
        .subscribe({
          next: (data: any) => {
            alert('Success..')
            this.router.navigate(['/admin/task']);
          }
        })
    } else {
      return;
    }

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
  expandedQuestions: boolean[] = [];
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
}
