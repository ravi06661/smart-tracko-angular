import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Component } from '@angular/core';
import { Task } from 'src/app/entity/task';
import { LoginService } from 'src/app/service/login.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  ATTACHMENT_URL = this.BASE_URL+'/file/download/taskAndAssignmentAttachment/'
  tasks: Task[] = []
  taskSubmissionList:StudentTaskSubmittion[]=[]
  taskSubmissionObj:StudentTaskSubmittion = new StudentTaskSubmittion

  constructor(private taskService: TaskServiceService,
              private loginService:LoginService,
              private utilityService:UtilityServiceService) { }

  ngOnInit() {
  this.getAllTask();
  this.getSubmitedTaskByStudent();
  }

  public getAllTask() {
    this.taskService.getAllTask(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.tasks = data
      }
    )
  }

  public getSubmitedTaskByStudent(){
    this.taskService.getSubmitedTaskByStudent(this.loginService.getStudentId()).subscribe({
      next:(data:any)=>{
        this.taskSubmissionList = data
      }
    })
  }
}
