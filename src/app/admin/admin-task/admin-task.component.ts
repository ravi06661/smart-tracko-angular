import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Subject } from 'src/app/entity/subject';
import { SubmissionAssignmentTaskStatus } from 'src/app/entity/submission-assignment-task-status';
import { Task } from 'src/app/entity/task';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-task',
  templateUrl: './admin-task.component.html',
  styleUrls: ['./admin-task.component.scss']
})
export class AdminTaskComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  IMG_URL = this.BASE_URL + '/file/getImageApi/images/'
  task: TaskRequest = new TaskRequest()
  subjects: Subject[] = []
  courses: Course[] = []
  submitedTasksList: StudentTaskSubmittion[] = []
  taskSubmissionStatus: SubmissionAssignmentTaskStatus[] = []
  taskSubmissionStatus2: SubmissionAssignmentTaskStatus = new SubmissionAssignmentTaskStatus
  totalSubmitted = 0;
  reveiwed = 0;
  unReveiwed = 0;

  firstTaskForm: FormGroup;
  message: string = ''

  constructor(private subjectService: SubjectService,
    private courseService: CourseServiceService,
    private taskService: TaskServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder) {

    this.firstTaskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      course: ['', Validators.required],
      subject: ['', Validators.required],
      taskAttachment: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getCourses();
    this.getAllSubmitedTasks()
    this.getAllSubmissionTaskStatus()
    this.getOverAllAssignmentTaskStatus()
  }

  public isFieldInvalidForTaskForm(fieldName: string): boolean {
    const field = this.firstTaskForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public firstTaskFormControl() {
    Object.keys(this.firstTaskForm.controls).forEach(key => {
      const control = this.firstTaskForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  public submit() {
    this.firstTaskFormControl();
    if (this.firstTaskForm.valid) {
      this.taskService.addTask(this.task).subscribe(
        (data: any) => {
          console.log(data);
          this.router.navigate(['/admin/createtask/' + data.taskId])
        }
      )
    }
    //  this.router.navigate(['/admin/createtask/1056'])
  }

  public getAllSubmitedTasks() {
    this.taskService.getAllSubmitedTasks().subscribe({
      next: (data: any) => {
        this.submitedTasksList = data;
        this.getOverAllAssignmentTaskStatus()
      }
    })
  }

  public pageRanderWithObject(object: StudentTaskSubmittion) {
    this.router.navigate(['/admin/submission'], {
      queryParams: {
        data: JSON.stringify(object)
      }
    })
  }
  public getAllSubmissionTaskStatus() {
    this.taskService.getAllSubmissionTaskStatus().subscribe(
      (data: any) => {
        this.taskSubmissionStatus = data
        this.getOverAllAssignmentTaskStatus()
      }
    )
  }
  // public getOverAllAssignmentTaskStatus() {
  //   this.taskService.getOverAllAssignmentTaskStatus().subscribe(
  //     (data: any) => {
  //       this.taskSubmissionStatus2 = data;
  //       this.totalSubmitted =  this.calculatePercentage(this.submitedTasksList.length,this.taskSubmissionStatus.length) 
  //       this.reveiwed = this.calculatePercentage(this.taskSubmissionStatus2.totalSubmitted,this.taskSubmissionStatus2.reveiwed) 
  //       this.unReveiwed = this.calculatePercentage(this.taskSubmissionStatus2.totalSubmitted,this.taskSubmissionStatus2.unReveiwed) 
  //      }
  //   )
  // }

  public calculatePercentage(total: number, num: number) {
    return Math.floor(num / total * 100);
  }

  public clearTaskForm() {
    this.task = new TaskRequest();
    this.firstTaskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      course: ['', Validators.required],
      subject: ['', Validators.required],
      taskAttachment: ['', Validators.required]
    })
  }

  public getOverAllAssignmentTaskStatus() {
    this.taskService.getOverAllAssignmentTaskStatus().subscribe(
      (data: any) => {
        this.taskSubmissionStatus2 = data;
        let count = 0;
        let arr: number[] = [];
        this.submitedTasksList.forEach(obj => {
          if (!arr.find(id => id === obj.taskId)) {
            arr.push(obj.taskId);
            count += 1;
          }
        });
        this.totalSubmitted = count;
        this.totalSubmitted = this.calculatePercentages(this.totalSubmitted, this.taskSubmissionStatus.length)
        this.reveiwed = this.calculatePercentages(this.taskSubmissionStatus2.reveiwed, this.totalSubmitted)
        this.unReveiwed = this.calculatePercentages(this.taskSubmissionStatus2.unReveiwed, this.totalSubmitted)
      }
    )
  }


  calculatePercentages(num1: number, num2: number) {
    let per: any;
    per = Math.floor((num1 / num2) * 100);
    if (num2 < 0) {
      num2 = 0
      per = 0;
    }
    return per;
  }
}
