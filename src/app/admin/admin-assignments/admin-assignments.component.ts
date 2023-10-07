import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isThisQuarter } from 'date-fns';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { SubmissionAssignmentTaskStatus } from 'src/app/entity/submission-assignment-task-status';
import { TaskQuestion } from 'src/app/entity/task-question';
import { AssignmentRequest } from 'src/app/payload/assignment-request';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-assignments',
  templateUrl: './admin-assignments.component.html',
  styleUrls: ['./admin-assignments.component.scss']
})
export class AdminAssignmentsComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  IMG_URL = this.BASE_URL + '/file/getImageApi/images/'
  assignmentRequest: AssignmentRequest = new AssignmentRequest;
  courses: Course[] = [];
  subjects: Subject[] = [];
  subjectes: SubjectResponse[] = [];
  allActiveAssignments: Assignment[] = []
  assignmentQuestions: TaskQuestion[] = []
  submitedAssignments: AssignmentSubmission[] = []
  submitedAssignmentObj: AssignmentSubmission = new AssignmentSubmission
  taskSubmissionStatus: SubmissionAssignmentTaskStatus[] = []
  taskSubmissionStatus2: SubmissionAssignmentTaskStatus = new SubmissionAssignmentTaskStatus
  message:string=''

  totalSubmitted = 0;
  reveiwed = 0;
  unReveiwed = 0;
  courseId = 0;
  subjectId = 0;

  submissionForm: FormGroup
  constructor(private courseService: CourseServiceService,
    private subjectService: SubjectService,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private formBuilder: FormBuilder) {
    this.submissionForm = this.formBuilder.group({
      subjectId: ['', Validators.required],
      courseId: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllCourses();
    this.getAllSubmitedAssignments();
    this.getAllAssignment();
    this.getAllSubmissionAssignmentStatus()
    this.getOverAllAssignmentTaskStatus()
    this.getAllSubject()
  }

  public getAllCourses() {
    this.courseService.getAllCourses(0,100).subscribe({
      next: (data: any) => {
        this.courses = data.response;
      }
    })
  }
  public getAllSubject() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data: any) => {
        this.subjectes = data;
      }
    })
  }

  public getSubject(id: number) {
    let subjects = this.courses.find(course => course.courseId == id)?.subjects;
    if (subjects != null)
      this.subjects = subjects
  }

  public createAssingment() {
  //  if(this.submissionForm.invalid){
  //   this.submissionFormFun()
  //   return;
  //  }else{
  //   this.assignmentService.createAssignment(this.assignmentRequest).subscribe({
  //     next: (data: any) => {
  //       this.router.navigate(['/admin/createassignments/' + data.id])
  //     },
  //     error: (error) => {
  //        this.message = error.error.message
  //      }
  //   }
  //   )
  //  }
  this.router.navigate(['/admin/createassignments/' + 883])
  }

  public getAllSubmitedAssignments() {
    this.assignmentService.getAllSubmitedAssignments().subscribe({
      next: (data: any) => {
        this.submitedAssignments = data
      }
    })
  }

  public pageRanderWithObj(object: AssignmentSubmission) {
    this.router.navigate(['/admin/assignmentsubmission'], {
      queryParams: {
        data: JSON.stringify(object)
      }
    })
  }

  public getAllAssignment() {
    this.assignmentService.getAllAssignments().subscribe((
      (data: any) => {
        this.allActiveAssignments = data
        this.allActiveAssignments.forEach((temp: any) => {
          temp.assignmentQuestion.forEach((t: any) => {
            this.assignmentQuestions.push(t)
          })
        })
      }
    ))
  }
  public getAllSubmissionAssignmentStatus() {
    this.assignmentService.getAllSubmissionAssignmentTaskStatus().subscribe(
      (data: any) => {
        this.taskSubmissionStatus = data;
      }
    )
  }

  public getOverAllAssignmentTaskStatus() {
    this.assignmentService.getOverAllAssignmentTaskStatus().subscribe(
      (data: any) => {
        this.taskSubmissionStatus2 = data;
        this.totalSubmitted = this.taskSubmissionStatus2.totalSubmitted
        this.reveiwed = this.taskSubmissionStatus2.reveiwed
        this.unReveiwed = this.taskSubmissionStatus2.unReveiwed
      }
    )
  }

  courseFilter(event: any) {
    const selectedCourseId = event.target.value;
    if (selectedCourseId !== "") {
      this.courseService.getCourseByCourseId(selectedCourseId).subscribe(
        (data: any) => {
          this.assignmentRequest.courseId = data.courseId;

        }
      );
    } else {
      this.assignmentRequest.courseId = 0;

    }
  }

  course: Course = new Course
  courseFilterByCourseIdAndSubjectId(course: Course, subjectId: number) {
    this.course = course;
    this.assignmentService.getAllSubmissionAssignmentTaskStatusByCourseIdFilter(this.course.courseId, subjectId).subscribe((
      (data: any) => {
        this.taskSubmissionStatus = data
        this.subjects = course.subjects
      }
    ))
  }
  selectCourseSubject(subject: Subject) {
    this.subjectId = subject.subjectId
  }

  public clearFormSubmission() {
    this.submissionForm = this.formBuilder.group({
      subjectId: ['', Validators.required],
      courseId: ['', Validators.required],
      title: ['', Validators.required],
    });
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

