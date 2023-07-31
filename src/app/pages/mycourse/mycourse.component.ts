import { BatchesService } from 'src/app/service/batches.service';
import { Course } from './../../entity/course';
import { Component, OnInit } from '@angular/core';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { JavaScriptLoaderService } from 'src/app/service/java-script-loader.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Batch } from 'src/app/entity/batch';

@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.scss']
})
export class MycourseComponent implements OnInit {

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/technologyStackImage/';

  courses:Course[]=[];
  batches:Batch[]=[]

  constructor(private couserService:CourseServiceService,private utilityService:UtilityServiceService,private batchService:BatchesService) {}

  ngOnInit(): void {
    this.getAllCourses(0,5);
    this.getAllBatches()
  }

  public getAllCourses(page:number,size:number){
    this.couserService.getAllCourses(page,size).subscribe({
      next:(data:any)=>{
        this.courses = data.response;
        console.log(this.courses);
        
      }
    })
  }
  public getAllBatches(){
    this.batchService.getAllBatch().subscribe({
      next:(data:any)=>{
        this.batches = data.response;
        console.log(this.batches);
        
      }
    })
  }
}
