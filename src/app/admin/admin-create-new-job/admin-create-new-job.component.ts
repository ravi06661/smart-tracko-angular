import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobAlert } from 'src/app/entity/job-alert';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { JobAlertRequest } from 'src/app/payload/job-alert-request';
import { JobAlertService } from 'src/app/service/job-alert.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-create-new-job',
  templateUrl: './admin-create-new-job.component.html',
  styleUrls: ['./admin-create-new-job.component.scss']
})
export class AdminCreateNewJobComponent implements OnInit{
  imageUrl = this.utilityService.getBaseUrl()+"/file/getImageApi/technologyStackImage/";
  jobAlert:JobAlert=new JobAlert();
  jobAlertRequest:JobAlertRequest=new JobAlertRequest();
  jobAlerts:JobAlert[]=[];
  technologyStack:TechnologyStack[]=[];
  imageName = ''
  constructor(private jobAlertService: JobAlertService, private technologyStackService: TechnologyStackService, private router: Router,private utilityService:UtilityServiceService) { }
  ngOnInit(): void {
    this.getAllTechImages();
  }

  createJob(){
    this.jobAlertService.addJob(this.jobAlertRequest).subscribe(
      (data: any) => {
        if(this.jobAlertRequest.type=='JOB'){
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'success',
          title: 'job Add success !!'
        }).then(e => {
          this.jobAlert = new JobAlert
          this.router.navigate(['/admin/jobalert']);
        })
      }else{
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'success',
          title: 'Internship Add success !!'
        }).then(e => {
          this.jobAlert = new JobAlert
          this.router.navigate(['/admin/jobalert']);
        })
      }
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'error',
          title: ' failed !!'
        })
      }
   
    )
  
  }

  public getAllTechImages(){
    this.technologyStackService.getAllTechnologyStack().subscribe({
      next:(data:any)=>{
        this.technologyStack = data
      }
    });
  }
}
