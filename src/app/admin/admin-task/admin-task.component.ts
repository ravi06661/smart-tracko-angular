import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sub } from 'date-fns';
import { Course } from 'src/app/entity/course';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Subject } from 'src/app/entity/subject';
import { SubmissionAssignmentTaskStatus } from 'src/app/entity/submission-assignment-task-status';
import { Task } from 'src/app/entity/task';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { ToastService } from 'src/app/service/toast.service';
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
  courseId: number = 0

  firstTaskForm: FormGroup;
  message: string = ''
  subjectes: SubjectResponse[] = [];

  constructor(private subjectService: SubjectService,
    private courseService: CourseServiceService,
    private taskService: TaskServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder,
    private toast: ToastService) {

    this.firstTaskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      course: ['', Validators.required],
      subject: ['', Validators.required],
      taskAttachment: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getCourses();
    this.getAllSubmittedTaskFilter(0, 0)
    this.getAllSubmissionTaskStatus()
    this.getOverAllAssignmentTaskStatus()
    this.courseFilterByCourseIdAndSubjectId(0, 0)
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
        {
          next: (data: any) => {
            this.toast.showSuccess(data.message, 'Success')
            // this.firstTaskForm.reset()
            this.router.navigate(['/admin/createtask/' + data.taskId])
          },
          error: (er: any) => {
            this.toast.showError(er.error.message, 'Error')
          }
        }
      )
    }
  }

  public getAllSubmittedTaskFilter(courseId: number, subjectId: number) {
    this.courseId = courseId;
    if (courseId) {
      this.getCourseSubject(courseId)
    }
    this.taskService.getAllSubmitedTasks(courseId, subjectId).subscribe({
      next: (data: any) => {
        this.submitedTasksList = data;

      }
    })
  }

  public getAllSubmissionTaskStatus() {
    this.taskService.getAllSubmissionTaskStatus().subscribe(
      (data: any) => {
        this.taskSubmissionStatus = data
      }
    )
  }

  public getOverAllAssignmentTaskStatus() {
    this.taskService.getOverAllAssignmentTaskStatus().subscribe(
      (data: any) => {
        //  this.taskSubmissionStatus2 = data;
        this.totalSubmitted = data.totalCount
        //this.totalSubmitted = this.calculatePercentages(this.totalSubmitted,)
        this.reveiwed = data.reviewedCount// = this.calculatePercentages(this.totalSubmitted , data.reviewedCount)
        this.unReveiwed = data.unreviewedCount//= this.calculatePercentages(this.totalSubmitted , data.unreviewedCount)
      }
    )
  }


  calculatePercentages(num1: number, num2: number) {
    if (num2 !== 0)
      return Math.floor((num1 / num2) * 100);
    else
      return 0;

  }

  public getCourseSubject(id?: any) {

    this.subjectService.getAllSubjectsByCourseId(id ? id : this.task.course.courseId).subscribe({
      next: (data: any) => {
        this.subjectes = []
        this.subjectes = data.subjects;
      },
      error: (er: any) => {
      //  this.toast.showError(er.error.message, 'Error')
      }
    })
  }

  courseFilterByCourseIdAndSubjectId(course: number, subjectId: number) {
    this.courseId = course;
    this.getCourseSubject(course)
    this.taskService.getAllSubmissionTaskStatusByCourseIdAndSubjectIdFilter(course, subjectId).subscribe((
      (data: any) => {
        this.taskSubmissionStatus = data.data
        //  this.subjects = course.subjects
        console.log(data.data);
      }
    ))
  }

  public pageRanderWithObj(id: any) {
    const dataParams = {
      submissionId: id
    };
    this.router.navigate(['/admin/submission'], {
      queryParams: dataParams
    });
  }
}
