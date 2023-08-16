import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { CourseServiceService } from 'src/app/service/course-service.service';

@Component({
  selector: 'app-admin-courses-batches',
  templateUrl: './admin-courses-batches.component.html',
  styleUrls: ['./admin-courses-batches.component.scss']
})
export class AdminCoursesBatchesComponent implements OnInit{

  courseId:number = 0
  course:Course = new Course();
  totalSubjects = 0
  totalBatches = 0

  constructor(private activateRoute:ActivatedRoute,private courseService:CourseServiceService){}

  ngOnInit(): void {
    this.courseId=this.activateRoute.snapshot.params[('courseId')];
    this.getCourseByCourseId();
  }

  public getCourseByCourseId(){
    this.courseService.getCourseByCourseId(this.courseId).subscribe({
      next:(data:any)=>{
        this.course = data;
        this.totalSubjects = this.course.subjects.length
      }
    })
  }

}
