import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { AssignmentRequest } from 'src/app/payload/assignment-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-admin-assignments',
  templateUrl: './admin-assignments.component.html',
  styleUrls: ['./admin-assignments.component.scss']
})
export class AdminAssignmentsComponent implements OnInit{

  assignmentRequest:AssignmentRequest = new AssignmentRequest;
  courses:Course[] = [];
  subjects:Subject[] = [];


  constructor(private courseService:CourseServiceService,
              private subjectService:SubjectService,
              private assignmentService:AssignmentServiceService,
              private router:Router){}

  ngOnInit(): void {
    this.getAllCourses();
  }

  public getAllCourses(){
    this.courseService.getAll().subscribe({
      next:(data:any)=>{
        this.courses = data;
      }
    })
  }

  public getSubject(id:number){
    let subjects = this.courses.find(course=> course.courseId==id)?.subjects;
    if(subjects != null)
      this.subjects = subjects
  }

  public createAssingment(){
    this.assignmentService.createAssignment(this.assignmentRequest).subscribe({
      next:(data:any)=>{
        this.router.navigate(['/admin/createassignments/'+data.id])
      }
    })
  }

  


}

