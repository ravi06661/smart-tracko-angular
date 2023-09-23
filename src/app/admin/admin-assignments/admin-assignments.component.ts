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
  taskSubmissionStatus2: SubmissionAssignmentTaskStatus= new SubmissionAssignmentTaskStatus
  
  courseLenght=0;
  subjectLenght=0;
  totalSubmitted = 0;
  reveiwed = 0;
  unReveiwed = 0;
  courseId=0;


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
    this.getAllSubject()
  }

  public getAllCourses() {
    this.courseService.getAll().subscribe({
      next: (data: any) => {
        this.courses = data;
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
    this.assignmentService.createAssignment(this.assignmentRequest).subscribe({
      next: (data: any) => {
        this.router.navigate(['/admin/assignments/' ])

       // this.router.navigate(['/admin/assignmentsDetails/' + data.id])
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
        this.courseLenght=this.allActiveAssignments.length;
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
        this.courseLenght=this.allActiveAssignments.length;     
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
        //= this.courseLenght=this.taskSubmissionStatus2.length
       }
    )
  }
     
  courseFilter(event:any){
    const selectedCourseId=event.target.value;
    if(selectedCourseId !==""){
    this.courseService.getCourseByCourseId(selectedCourseId).subscribe(
    (data:any)=>{
      this.assignmentRequest.courseId=data.courseId;
     
    }
    );
  }else{
    this.assignmentRequest.courseId=0;
  
  }
}

  courseFilterBySubject(subjectId:number){
    this.assignmentService.getAllSubmissionAssignmentTaskStatusByCourseIdFilter(this.courseId,subjectId).subscribe((
      (data:any)=>{
        this.taskSubmissionStatus=data
         this.courseLenght=this.taskSubmissionStatus.length;
        console.log(data);
        
      }
    ))
  }
  courseFilterByCourse(courseId:number){
    this.assignmentService.getAllSubmissionAssignmentTaskStatusByCourseIdFilter(this.courseId,0).subscribe((
      (data:any)=>{
        this.taskSubmissionStatus=data
         this.courseLenght=this.taskSubmissionStatus.length
        console.log(data);
        
      }
    ))
    
  }
  setCourseSubject(course:Course){
   this.subjects=course.subjects
    this.courseId =course.courseId
  }

}

