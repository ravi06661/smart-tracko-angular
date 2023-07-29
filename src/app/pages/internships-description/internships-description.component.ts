import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { an } from '@fullcalendar/core/internal-common';
import { JobAlert } from 'src/app/entity/job-alert';
import { JobAlertService } from 'src/app/service/job-alert.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-internships-description',
  templateUrl: './internships-description.component.html',
  styleUrls: ['./internships-description.component.scss']
})
export class InternshipsDescriptionComponent {
  id:number=0
  jobAlert:JobAlert =  new JobAlert
  BASE_URL=this.utilityService.getBaseUrl();  
  imageUrl=this.BASE_URL+'/file/getImageApi/technologyStackImage/';

  constructor(private activatedRoute: ActivatedRoute ,private jobAlertService :JobAlertService ,private utilityService:UtilityServiceService )  {}

  ngOnInit(): void {
   this.id=this.activatedRoute.snapshot.params[('id')]
   this.jobAlertService.getJob(this.id).subscribe(
    (data)=>{
      this.jobAlert =data
     }
   )
  }
}
