import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Task } from 'src/app/entity/task';
import { LoginService } from 'src/app/service/login.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  ATTACHMENT_URL = this.BASE_URL+'/file/download/taskAndAssignmentAttachment/'
  imageUrl = this.BASE_URL+'/file/getImageApi/taskAndAssignmentImages/';

  taskId: number = 0;
  task = new Task
  taskSubmittion: StudentTaskSubmittion = new StudentTaskSubmittion();
  message: string = ''
  constructor(private taskService: TaskServiceService, private router: ActivatedRoute, private utilityService: UtilityServiceService, private loginService: LoginService) { }

  ngOnInit() {
    this.taskId = this.router.snapshot.params[('id')]
    this.getTask();
  }
  public getTask() {
    this.taskService.getTaskById(this.taskId).subscribe(
      (data: any) => {
        this.task = data;
      }
    )
  }
  public submitTask() {
    this.taskSubmittion.student.studentId = this.loginService.getStudentId();
    this.taskService.submitTask(this.taskSubmittion,this.taskId).subscribe(
      (data) => {
        this.taskSubmittion = new StudentTaskSubmittion
        this.message = "Success.."
        alert("success");
      }
    )
  }
  public reaload() {
    this.message = ''
  }
  public deleteFile() {
    
  }
  public setImage(event:any){
   this.taskSubmittion.submittionFileName=event.target.files[0];
  }
}

