import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { Task } from 'src/app/entity/task';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
  taskId: number = 0;
  task = new Task
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  taskSubmittion: StudentTaskSubmittion = new StudentTaskSubmittion();
  constructor(private taskService: TaskServiceService, private router: ActivatedRoute, private utilityService: UtilityServiceService) { }


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
    this.taskService.submitTask(this.taskSubmittion).subscribe(
      (data) => {
       
      }
    )
  }
}
