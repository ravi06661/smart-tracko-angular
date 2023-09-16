import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isThisQuarter } from 'date-fns';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { SubmissionAssignmentTaskStatus } from 'src/app/entity/submission-assignment-task-status';
import { TaskQuestion } from 'src/app/entity/task-question';
import { AssignmentRequest } from 'src/app/payload/assignment-request';
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
  allActiveAssignments: Assignment[] = []
  assignmentQuestions: TaskQuestion[] = []
  submitedAssignments: AssignmentSubmission[] = []
  submitedAssignmentObj: AssignmentSubmission = new AssignmentSubmission
  taskSubmissionStatus: SubmissionAssignmentTaskStatus[] = []
  taskSubmissionStatus2: SubmissionAssignmentTaskStatus= new SubmissionAssignmentTaskStatus
  
  totalSubmitted = 0;
  reveiwed = 0;
  unReveiwed = 0;

  constructor(private courseService: CourseServiceService,
    private subjectService: SubjectService,
    private assignmentService: AssignmentServiceService,
    private router: Router,
    private utilityService: UtilityServiceService) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.getAllSubmitedAssignments();
    this.getAllAssignment();
    this.getAllSubmissionAssignmentStatus()
    this.getOverAllAssignmentTaskStatus()
  }

  public getAllCourses() {
    this.courseService.getAll().subscribe({
      next: (data: any) => {
        this.courses = data;
      }
    })
  }

  public getSubject(id: number) {
    let subjects = this.courses.find(course => course.courseId == id)?.subjects;
    if (subjects != null)
      this.subjects = subjects
  }

  public createAssingment() {
    this.assignmentService.createAssignment(this.assignmentRequest).subscribe({
      next: (data: any) => {
        this.router.navigate(['/admin/createassignments/' + data.id])
      }
    })
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

  public getOverAllAssignmentTaskStatus(){
    this.assignmentService.getOverAllAssignmentTaskStatus().subscribe(
       (data:any)=>{
        this.taskSubmissionStatus2 = data;
        this.totalSubmitted = this.taskSubmissionStatus2.totalSubmitted
        this.reveiwed = this.taskSubmissionStatus2.reveiwed
        this.unReveiwed = this.taskSubmissionStatus2.unReveiwed
       }
    )
  }
}

