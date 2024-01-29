import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { TaskRequest } from '../payload/task-request';
import { StudentTaskSubmittion } from '../entity/student-task-submittion';
import { TaskQuestionRequest } from '../payload/task-question-request';
import { Task } from '../entity/task';
import { s } from '@fullcalendar/core/internal-common';
import { TaskQuestion } from '../entity/task-question';

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
  public getAllTask(studentId: number) {
    return this.http.get(`${this.TASK_URL}/getAllTaskOfStudent?studentId=${studentId}`);
  }
  public submitTask(task: StudentTaskSubmittion, taskId: number) {
    let formData = new FormData();
    formData.append('studentId', task.studentId.toString())
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
  public deleteTaskQuestion(questionId: number) {
    return this.http.delete(`${this.TASK_URL}/deleteTaskQuestion?questionId=${questionId}`)
  }
  public addAssignment(taskData: Task) {
    let formData = new FormData();
    formData.append('taskId', taskData.taskId.toString())
    formData.append('attachment', taskData.taskAttachment);
    return this.http.post(`${this.TASK_URL}/addTaskAttachment`, formData);
  }

  public getAllSubmitedTasks(courseId: any, subjectId: any) {
    const params = {
      courseId: courseId,
      subjectId: subjectId
    };
    return this.http.get(`${this.TASK_URL}/getAllSubmitedTask`, { params });
  }

  getAllSubmissionTaskStatus() {
    return this.http.get(`${this.TASK_URL}/getAllSubmissionTaskStatus`)
  }

  public getSubmitedTaskByStudent(studentId: number) {
    return this.http.get(`${this.TASK_URL}/getSubmitedTaskForStudent?studentId=${studentId}`)
  }

  public updateSubmitedTaskStatus(submissionId: string, status: string, review: string) {
    let formData = new FormData();
    formData.append('submissionId', submissionId);
    formData.append('status', status);
    formData.append('review', review);
    return this.http.put(`${this.TASK_URL}/updateSubmitedAssignmentStatus`, formData);
  }

  public getOverAllAssignmentTaskStatus() {
    return this.http.get(`${this.TASK_URL}/getOverAllTaskStatusforBarChart`)
  }

  public isSubmitted(taskId: number, studentId: number) {
    const params = new HttpParams()
      .append('taskId', taskId.toString())
      .append('studentId', studentId.toString());

    return this.http.get(`${this.TASK_URL}/isTaskSubmitted`, { params });
  }

  getSubmissionTaskById(id: any) {
    return this.http.get<any>(`${this.TASK_URL}/getSubmissionTaskById?id=${id}`)
  }
  public getQuestion(taskQuestionId: number) {
    return this.http.get<any>(`${this.TASK_URL}/getTaskQuestion?questionId=${taskQuestionId}`)
  }

  public getAllSubmissionTaskStatusByCourseIdAndSubjectIdFilter(courseId: number, subjectId: number) {
    return this.http.get(`${this.TASK_URL}/getAllSubmissionTaskStatusByCourseIdAndSubjectId?courseId=${courseId}&subjectId=${subjectId}`)
  }

  public updateTaskquestion(question: TaskQuestion, imagePreview: File[]) {
    let formData = new FormData();
    formData.append('question', question.question)
    formData.append('videoUrl', question.videoUrl)
    formData.append('questionId', question.questionId.toString())
    if (question.questionImages != null) {
      question.questionImages.forEach((t) => {
        formData.append('questionImages', t)
      })
    }

    if (imagePreview != null) {
      imagePreview.forEach((t) => {
        formData.append('newImages', t)
      })
    }
    return this.http.put(`${this.TASK_URL}/updateTaskQuestion`, formData)
  }
}
