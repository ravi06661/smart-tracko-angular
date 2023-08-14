import { CourseServiceService } from 'src/app/service/course-service.service';
import { CourseRequest } from './../../payload/course-request';
import { Component, OnInit } from '@angular/core';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { Course } from 'src/app/entity/course';
import { Subject, SubjectLike } from 'rxjs';
import { SubjectService } from 'src/app/service/subject.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {
  subjects:any [] = [];
  courseRequest:CourseRequest = new CourseRequest();
  selectedSubjectIds: number[] = [];
  techImages:TechnologyStack[] = [];
  message='';
  courses:Course[]=[];
  totalBatches = 0;
  totalSubjects = 0;

  constructor(private courseService:CourseServiceService,private techService:TechnologyStackService,
    private subjectService:SubjectService){}

  ngOnInit(): void {
    this.getAllCourses();  
  }


  checkboxChanged(subjectId: number) {
    const index = this.courseRequest.subjectIds.indexOf(subjectId);

    if (index === -1) {
      this.courseRequest.subjectIds.push(subjectId);
    } else {
      this.courseRequest.subjectIds.splice(index, 1);
    }
  }

  public saveCourse(){
    this.courseService.saveCourse(this.courseRequest).subscribe({
      next:(data:any)=>{
        this.message = data.message
        if(this.message=='SUCCESS'){
          this.getAllCourses();
        }

      }
    })
  }

  public getAllCourses(){
    this.courseService.getAllCourses(0,10).subscribe({
      next:(data:any)=>{
        this.courses = data.response;
      }
    });
  }

  public getAllTechImages(){
    this.techService.getAllTechnologyStack().subscribe({
      next:(data:any)=>{
        this.techImages = data
      }
    });
  }

  public getAllSubjects(){
    this.subjectService.getAllSubjects().subscribe({
      next:(data:any)=>{
        this.subjects = data;
      }
    });
  }
}
