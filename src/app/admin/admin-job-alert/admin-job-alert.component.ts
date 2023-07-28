import { preserveWhitespacesDefault } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobAlert } from 'src/app/entity/job-alert';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { JobAlertService } from 'src/app/service/job-alert.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';


@Component({
  selector: 'app-admin-job-alert',
  templateUrl: './admin-job-alert.component.html',
  styleUrls: ['./admin-job-alert.component.scss'],
  preserveWhitespaces: true
})
export class AdminJobAlertComponent implements OnInit {
  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL+'/File/getImageApi/technologyStackImage/';

  jobs: JobAlert[] = [];
  jobData: JobAlert = new JobAlert;
  technologyStack: TechnologyStack[] = []
  pageNumber: number = 0
  pageSize = 10;
  totaljobAlert=0;
  length:number=0
  constructor(private jobAlertService: JobAlertService, private technologyStackService: TechnologyStackService, private router: Router,private utilityService:UtilityServiceService) { }

  ngOnInit() {
    this.getAllJobs();
  }

  public getAllJobs() {
    this.jobAlertService.getAllJobsAndIntership(this.pageNumber, this.pageSize).subscribe(
      (data: any) => {
        this.jobs = data.content;
        this.totaljobAlert = data.totalElements
      }
    )
  }
  public activeJob(id: number) {
    console.log(id)
    this.jobAlertService.activeJob(id).subscribe(
      (data) => {
      }
    )
  }

  delete(id: number) {
  
    this.jobAlertService.delete(id).subscribe(
      (data) => {
  
        this.getAllJobs();
      }
    )
  }
  submit() {
    this.jobAlertService.addJob(this.jobData).subscribe(
      (data) => {
        this.ngOnInit()
      }
    )
  }
  getTechnologyStack() {
    this.technologyStackService.getAllTechnologyStack().subscribe(
      (data: any) => {
        this.technologyStack = data
      }
    )
  }

  searchJob(data: any) {
    if (data == '') {
      this.getAllJobs()
    } else {
      this.jobAlertService.searchJobs(data,'admin').subscribe(
        (data: any) => {
          this.jobs = data;
        }
      )
    }
  }
  public pageChange(event:any){
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length
    this.getAllJobs();
  }
}
