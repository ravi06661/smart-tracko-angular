import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { TaskRequest } from '../payload/task-request';
import { StudentTaskSubmittion } from '../entity/student-task-submittion';
import { TaskQuestionRequest } from '../payload/task-question-request';
import { Task } from '../entity/task';

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
  public getAllTask() {
    return this.http.get(`${this.TASK_URL}/getAllTask`);
  }
  public submitTask(task: StudentTaskSubmittion, taskId: number) {
    let formData = new FormData();
    // formData.append('studentId', task.studentId.toString())
    formData.append('submittionFileName', task.submittionFileName)
    formData.append('taskDescription', task.taskDescription)
    formData.append('taskId', taskId.toString())
    return this.http.post(`${this.TASK_URL}/studentTaskSubmittion`, formData)
  }
  public addQuestionInTask(taskQuestion: TaskQuestionRequest, taskId: number) {
    let formData = new FormData();
    formData.append('question', taskQuestion.question)
    formData.append('videoUrl', taskQuestion.videoUrl)
    formData.append('taskId', taskId.toString())
    taskQuestion.questionImages.forEach((t) => {
      formData.append('questionImages', t)
    })
    return this.http.post(`${this.TASK_URL}/addQuestionInTask`, formData)
  }
  public deleteTaskQuestion(taskId: number, questionId: number) {
    return this.http.delete(`${this.TASK_URL}/deleteTaskQuestion?questionId=${questionId}&taskId=${taskId}`)
  }
  public addAssignment(taskData: Task) {
    let formData = new FormData();
    formData.append('taskId', taskData.taskId.toString())
    formData.append('attachment', taskData.submitFile);
    return this.http.post(`${this.TASK_URL}/addTaskAttachment`, formData);
  }

  public getAllSubmitedTasks() {
    return this.http.get(`${this.TASK_URL}/getAllSubmitedTask`);
  }
  getAllSubmissionTaskStatus() {
    return this.http.get(`${this.TASK_URL}/getAllSubmissionTaskStatus`)
  }
  public  getOverAllAssignmentTaskStatus() {
     return this.http.get(`${this.TASK_URL}/getOverAllAssignmentTaskStatus`)
  }

}
