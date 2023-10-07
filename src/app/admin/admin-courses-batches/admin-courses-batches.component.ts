import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { log, error } from 'console';
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
  batchId:number = 0;
  course:Course = new Course();
  totalSubjects = 0
  totalBatches = 0
  techImages:TechnologyStack[] = [];
  batchRequest:BatchRequest = new BatchRequest();
  batches:Batch[] = [];
  batch:Batch = new Batch();
  imageName = '';
  imageUrl = this.utilityService.getBaseUrl()+"/file/getImageApi/technologyStackImage/";
  createBatchFrom:FormGroup

  message = '';
  messageClass = ''

  constructor(private activateRoute:ActivatedRoute,private courseService:CourseServiceService,
    private batchService:BatchesService,private techService:TechnologyStackService,private utilityService:UtilityServiceService,private formBuilder:FormBuilder){
      this.createBatchFrom=this.formBuilder.group({
        selectedOption: ['', Validators.required],
        batchName: ['', Validators.required],
        batchStartDate: ['', Validators.required],
        batchTiming: ['', Validators.required],
        batchDetails: ['', Validators.required],
      });
    }

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

  isFieldInvalidForCreateBatchDetailsForm(fieldName: string): boolean {
    const field = this.createBatchFrom.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public createBatchDetailsFormSubmition() {
    Object.keys(this.createBatchFrom.controls).forEach(key => {
      const control = this.createBatchFrom.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public createNewBatch(){
    this.batchRequest.courseId = this.courseId;
    this.createBatchFrom.markAllAsTouched();
    if (this.createBatchFrom.valid )
    this.batchService.createNewBatch(this.batchRequest).subscribe({
      next:(data:any)=>{

          this.batchRequest = new BatchRequest()
          this.getCourseByCourseId();
          this.message = data.message;
          this.messageClass = 'text-success';
      },
      error:(err:any)=>{
        this.message = err.error.message;
        this.messageClass = 'text-danger';
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
          this.batch = new Batch();
          this.getCourseByCourseId();
          this.message = data.message;
          this.messageClass = 'text-success'
          this.clearValidationForm();
      },
      error:(err:any)=>{
        this.message = err.error.message;
        this.messageClass = 'text-danger';
      }
    })
  }

  public changeTimeFormat(time:any){
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }

  public checkSubjectInCourse(id:number){
    if(this.batch.subject.subjectId == id)
      return true
    return false;
  }

  public clearValidationForm(){
    this.createBatchFrom=this.formBuilder.group({
      selectedOption: ['', Validators.required],
      batchName: ['', Validators.required],
      batchStartDate: ['', Validators.required],
      batchTiming: ['', Validators.required],
      batchDetails: ['', Validators.required],
    });
  }

  
 
}
