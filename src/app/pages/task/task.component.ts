import { Component } from '@angular/core';
import { Task } from 'src/app/entity/task';
import { TaskServiceService } from 'src/app/service/task-service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  tasks: Task[] = []
  constructor(private taskService: TaskServiceService) { }
  ngOnInit() {
   this.getAllTask()
  }
  public getAllTask() {
    this.taskService.getAllTask().subscribe(
      (data: any) => {
        this.tasks = data
      }
    )
  }
}
