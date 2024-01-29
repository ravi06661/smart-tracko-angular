import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Component } from '@angular/core';
import { Task } from 'src/app/entity/task';
import { LoginService } from 'src/app/service/login.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentAttachment/'
  tasks: Task[] = []
  taskSubmissionList: StudentTaskSubmittion[] = []
  taskSubmissionList2: StudentTaskSubmittion[] = []
  taskSubmissionObj: StudentTaskSubmittion = new StudentTaskSubmittion

  constructor(private taskService: TaskServiceService,
    private loginService: LoginService,
    private utilityService: UtilityServiceService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getAllTask();
    this.getSubmitedTaskByStudent();
  }

  public getAllTask() {
    this.taskService.getAllTask(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.tasks = data.allTask
      }
    )
  }

  public getSubmitedTaskByStudent() {
    this.taskService.getSubmitedTaskByStudent(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.taskSubmissionList = data
        this.taskSubmissionList2 = data
      }
    })
  }

  todayDate: Date = new Date()
  public dateFormatter(date: Date) {
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }

  public getSubmissionTaskFilterByStatus(status: string) {
    this.taskSubmissionList2 = this.taskSubmissionList
    this.taskSubmissionList2 = this.taskSubmissionList2.filter(obj => {
      if (obj.status == status) {
        return obj
      } else
        return null;
    });
  }
}
