import { AssignmentQuestionRequest } from './../payload/assignment-question-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';
import { AssignmentRequest } from '../payload/assignment-request';
import { retry } from 'rxjs';
import { Question } from '../entity/question';
import { fr } from 'date-fns/locale';
import { TaskQuestionRequest } from '../payload/task-question-request';
import { an } from '@fullcalendar/core/internal-common';
import { AssignmentSubmissionRequest } from '../payload/assignment-submission-request';

@Injectable({
  providedIn: 'root'
})
export class AssignmentServiceService {


  BASE_URL = this.utilityService.getBaseUrl();
  assignmentUrl = this.BASE_URL + '/assignment';

  constructor(private http: HttpClient, private utilityService: UtilityServiceService) { }


  public createAssignment(assignmentRequest: AssignmentRequest) {
    return this.http.post(`${this.assignmentUrl}/createAssignment`, assignmentRequest);
  }

  public getAssignmentById(assignmentId: number) {
    return this.http.get(`${this.assignmentUrl}/getAssignment?assignmentId=${assignmentId}`);
  }

  public addQuestionInTask(question: TaskQuestionRequest, assignmentId: number) {
    console.log(question);

    let formData = new FormData();
    formData.append('question', question.question)
    formData.append('videoUrl', question.videoUrl)
    formData.append('assignmentId', assignmentId.toString())
    question.questionImages.forEach((t) => {
      formData.append('questionImages', t)
    })
    return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`, formData)
  }
  public deleteTaskQuestion(questionId: number) {
    return this.http.delete(`${this.assignmentUrl}/deleteTaskQuestion?questionId=${questionId}`)
  }
  public addAssignment(data: any) {
    let formData = new FormData();
    formData.append('assignmentId', data.id)
    formData.append('attachment', data.attachment)
    return this.http.post(`${this.assignmentUrl}/addAssignment`, formData)
  }

  public submitAssignment(assignmentSubmission: AssignmentSubmissionRequest, file: any) {
    let formData = new FormData();
    formData.append('assignmentSubmissionRequest', JSON.stringify(assignmentSubmission))
    formData.append('file', file)
    return this.http.post(`${this.assignmentUrl}/submitAssignment`, formData);
  }


  public addAssignmentQuestions(assignmentQuestionsData: AssignmentQuestionRequest) {
    const assignmentQuestionData = new FormData();
    assignmentQuestionsData.assignmentQuestion.forEach((taskQuestion, questionIndex) => {
      taskQuestion.questionImages.forEach((image, imageIndex) => {
        assignmentQuestionData.append(`questionImages[${questionIndex}][${imageIndex}]`, image);
      });
    });
    return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`, assignmentQuestionData)
  }

  //This Method for Student Uses
  public getAllAssignments() {
    return this.http.get(`${this.assignmentUrl}/getAllAssignments`);
  }

  public getAssignmentQuestionById(questionId: number, assignmentId: number) {
    return this.http.get(`${this.assignmentUrl}/getAssignmentQuesById?questionId=${questionId}&assignmentId=${assignmentId}`)
  }

  public getSubmitedAssignmetByStudentId(studentId: number) {
    return this.http.get(`${this.assignmentUrl}/getSubmitedAssignmetByStudentId?studentId=${studentId}`);
  }

  //This Method for Admin Uses
  public getAllSubmitedAssignments() {
    return this.http.get(`${this.assignmentUrl}/getAllSubmitedAssginments`);
  }

  public updateSubmitAssignmentStatus(submissionId: number, status: string, review: string) {
    const formData = new FormData();
    formData.append('submissionId', submissionId.toString());
    formData.append('status', status);
    formData.append('review', review);
    console.log(status);
    console.log(review);
    
    
    return this.http.put(`${this.assignmentUrl}/updateSubmitedAssignmentStatus`, formData);
  }

  public getAllSubmissionAssignmentTaskStatus() {
    return this.http.get(`${this.assignmentUrl}/getAllSubmissionAssignmentTaskStatus`)
  }

  public getOverAllAssignmentTaskStatus() {
    return this.http.get(`${this.assignmentUrl}/getOverAllAssignmentTaskStatus`)
  }
  public getAllLockedAndUnlockedAssignment(studentId: number) {
    return this.http.get(`${this.assignmentUrl}/getAllLockedAndUnlockedAssignment?studentId=${studentId}`)
  }

  public isSubmitted(questionId: number, studentId: number) {
    return this.http.get(`${this.assignmentUrl}/getAssignmentQuesSubmissionStatus?questionId=${questionId}&studentId=${studentId}`)
  }

  public getAllSubmissionAssignmentTaskStatusByCourseIdFilter(courseId: number, subjectId: number) {
    return this.http.get(`${this.assignmentUrl}/getAllSubmissionAssignmentTaskStatusByCourseIdFilter?courseId=${courseId}&subjectId=${subjectId}`)
  }

  public getSubmittedAssignmentBySubmissionId(submissionId: number) {
    return this.http.get(`${this.assignmentUrl}/getSubmittedAssignmentBySubmissionId?submissionId=${submissionId}`)
  }

}