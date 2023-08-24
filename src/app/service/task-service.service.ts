import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { TaskRequest } from '../payload/task-request';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  BASE_URL = this.utilityService.getBaseUrl();
  TASK_URL = this.BASE_URL + '/task';

  constructor(private utilityService: UtilityServiceService, private http: HttpClient) { }

  public addTask(task: TaskRequest) {
    return this.http.post(`${this.TASK_URL}/createTask`, task);
  }
  public getTaskById(id: number) {
    return this.http.get(`${this.TASK_URL}/getTaskById?taskId=${id}`)
  }
}
