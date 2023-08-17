import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import * as moment from 'moment';
import { Batch } from 'src/app/entity/batch';
import { Course } from 'src/app/entity/course';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { BatchRequest } from 'src/app/payload/batch-request';
import { BatchesService } from 'src/app/service/batches.service';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

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
  techImages:TechnologyStack[] = [];
  batchRequest:BatchRequest = new BatchRequest();
  batches:Batch[] = [];
  batch:Batch = new Batch();
  imageName = '';
  imageUrl = this.utilityService.getBaseUrl()+"/file/getImageApi/technologyStackImage/";

  constructor(private activateRoute:ActivatedRoute,private courseService:CourseServiceService,
    private batchService:BatchesService,private techService:TechnologyStackService,private utilityService:UtilityServiceService){}

  ngOnInit(): void {
    this.courseId=this.activateRoute.snapshot.params[('courseId')];
    this.getCourseByCourseId();
    this.getAllTechImages()
  }

  public getCourseByCourseId(){
    this.courseService.getCourseByCourseId(this.courseId).subscribe({
      next:(data:any)=>{
        this.course = data;
        this.totalSubjects = this.course.subjects.length
        this.totalBatches = this.course.batches.length
      }
    })
  }

  public createNewBatch(){
    this.batchRequest.courseId = this.courseId;
    this.batchService.createNewBatch(this.batchRequest).subscribe({
      next:(data:any)=>{
        if(data.success){
          alert('success')
          this.batchRequest = new BatchRequest()
          this.getCourseByCourseId();
        }
      }
    })
  }

  public getAllTechImages(){
    this.techService.getAllTechnologyStack().subscribe({
      next:(data:any)=>{
        this.techImages = data
      }
    });
  }

  public deleteBatch(id:number){
    this.batchService.deletBatch(id).subscribe({
      next:(data:any)=>{
        if(data.success){
          alert('success')
          this.getCourseByCourseId();
        }
      }
    })
  }

  public getBatchByBatchId(id:number){
    this.batchService.getBatchById(id).subscribe({
      next:(data:any)=>{
        this.batch = data
      }
    })
  }

  public updateBatch(){
    this.batchService.updateBatch(this.batch).subscribe({
      next:(data:any)=>{
        if(data.success){
          this.batch = new Batch();
          this.getCourseByCourseId();
        }
      }
    })
  }

  public changeTimeFormat(time:any){
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }
}
