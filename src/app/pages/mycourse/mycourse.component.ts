import { Course } from './../../entity/course';
import { Component, OnInit } from '@angular/core';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { JavaScriptLoaderService } from 'src/app/service/java-script-loader.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.scss']
})
export class MycourseComponent implements OnInit {

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/technologyStackImage/';

  courses:Course[]=[];

  constructor(private couserService:CourseServiceService,private utilityService:UtilityServiceService) {}

  ngOnInit(): void {
    this.getAllCourses(0,5);
  }

  public getAllCourses(page:number,size:number){
    this.couserService.getAllCourses(page,size).subscribe({
      next:(data:any)=>{
        this.courses = data.response;
        console.log(this.courses);
        
      }
    })
  }
}
