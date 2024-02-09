import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { PaginationManager } from 'src/app/entity/pagination-manager';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Subject } from 'src/app/entity/subject';
import { SubmissionAssignmentTaskStatus } from 'src/app/entity/submission-assignment-task-status';
import { PageRequest } from 'src/app/payload/page-request';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { ToastService } from 'src/app/service/toast.service';


@Component({
  selector: 'app-admin-task',
  templateUrl: './admin-task.component.html',
  styleUrls: ['./admin-task.component.scss']
})
export class AdminTaskComponent {

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

  pageRequest: PageRequest = new PageRequest()
  pageManager: PaginationManager = new PaginationManager()

  submissioTaskpageManager: PaginationManager = new PaginationManager();
  submissioTaskPageRequest: PageRequest = new PageRequest();

  constructor(private subjectService: SubjectService,
    private courseService: CourseServiceService,
    private taskService: TaskServiceService,
    private router: Router,
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
    this.getAllSubmittedTaskFilter(0, 0, 'NOT_CHECKED_WITH_IT', this.submissioTaskPageRequest)
    this.getOverAllAssignmentTaskStatus()
    this.courseFilterByCourseIdAndSubjectId(0, 0, this.pageRequest)
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




  public submissionManageNextPrev(isNext: boolean) {
    let i = 0;
    if (isNext) i = this.submissioTaskPageRequest.pageNumber + 1;
    else i = this.submissioTaskPageRequest.pageNumber - 1;
    if (i >= 0 && i < this.submissioTaskpageManager.totalPages)
      this.submissionPage(i);
  }
  submissionPage(pageNumber: any) {
    if (pageNumber !== this.submissioTaskPageRequest.pageNumber) {
      this.submissioTaskPageRequest.pageNumber = pageNumber;
      this.getAllSubmittedTaskFilter(this.courseId, this.subjectId, 'NOT_CHECKED_WITH_IT', this.submissioTaskPageRequest);
    }
  }
  subjectId!: number
  public getAllSubmittedTaskFilter(courseId: number, subjectId: number, status: string, pageRequest: PageRequest, data?: any) {
    this.courseId = courseId;
    this.subjectId = subjectId
    if (courseId) {
      this.getCourseSubject(courseId)
    }
    this.taskService.getAllSubmitedTasks(courseId, subjectId, status, data ? new PageRequest() : this.submissioTaskPageRequest).subscribe({
      next: (data: any) => {
        this.taskSubmissionStatus = data.content
        this.submissioTaskpageManager.setPageData(data);
        this.submissioTaskPageRequest.pageNumber = data.pageable.pageNumber;
      }
    })
  }


  public manageNextPrev(isNext: boolean) {

    let i = 0;
    if (isNext) i = this.pageRequest.pageNumber + 1;
    else i = this.pageRequest.pageNumber - 1;
    if (i >= 0 && i < this.pageManager.totalPages)
      this.getTaskPage(i);
  }
  getTaskPage(pageNumber: any) {
    if (pageNumber !== this.pageRequest.pageNumber) {
      this.pageRequest.pageNumber = pageNumber;
      this.courseFilterByCourseIdAndSubjectId(this.courseId, this.subjectId, this.pageRequest);
    }
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

  courseFilterByCourseIdAndSubjectId(courseId: number, subjectId: number, pageRequest: PageRequest, data?: any) {
    this.courseId = courseId;
    this.getCourseSubject(courseId)
    this.taskService.getAllSubmissionTaskStatusByCourseIdAndSubjectIdFilter(courseId, subjectId, data ? new PageRequest() : pageRequest).subscribe({
      next: (data: any) => {
        this.taskSubmissionStatus = data.data.content
        this.pageManager.setPageData(data.data);
        this.pageRequest.pageNumber = data.data.pageable.pageNumber;
      },
      error: (er: any) => {
        console.log(er.error.message);
      }
    })
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
