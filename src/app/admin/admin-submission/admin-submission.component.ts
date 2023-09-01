import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-submission',
  templateUrl: './admin-submission.component.html',
  styleUrls: ['./admin-submission.component.scss']
})
export class AdminSubmissionComponent implements OnInit{
  BASE_URL = this.utilityService.getBaseUrl();
  IMG_URL = this.BASE_URL+'/file/getImageApi/images/'
  ATTACHMENT_URL = this.BASE_URL+'/file/download/taskAndAssignmentAttachment/'
  status = 'Unreviewed';
  review = ''
  submitedTask:StudentTaskSubmittion = new StudentTaskSubmittion
  constructor(private taskService:TaskServiceService,
              private activateRoute:ActivatedRoute,
              private utilityService:UtilityServiceService){}

  ngOnInit(){
    this.activateRoute.queryParams.subscribe(params => {
      const object = params['data'];
      this.submitedTask = JSON.parse(object);
     });

     if(this.submitedTask.status == this.status){
      this.updateSubmitedTaskStatus('Reviewing')
     }
  }

  public updateSubmitedTaskStatus(status:string){
    this.taskService.updateSubmitedTaskStatus(this.submitedTask.id,status,this.review).subscribe({
      next:(data:any)=>{
        this.submitedTask = data;
      }
    })
  }
}
