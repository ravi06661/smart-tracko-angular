import { AssignmentQuestionRequest } from './../payload/assignment-question-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';
import { AssignmentRequest } from '../payload/assignment-request';
import { retry } from 'rxjs';
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

  public  submitAssignment(assignmentSubmission: AssignmentSubmissionRequest,file:any) {
    let formData = new FormData();
    formData.append('assignmentSubmissionRequest',JSON.stringify(assignmentSubmission))
    formData.append('file',file)
    return this.http.post(`${this.assignmentUrl}/submitAssignment`,formData);
  }

  public addAssignmentQuestions(assignmentQuestionsData: AssignmentQuestionRequest) {

    // console.log(assignmentQuestionsData);
  //   const formData = new FormData();

   //  formData.append('taskAttachment',assignmentQuestionsData.taskAttachment)
  ///  formData.append('assignmentId',assignmentQuestionsData.assignmentId.toString())
    // assignmentQuestionsData.assignmentQuestion.forEach((question, questionIndex) => {
    //   formData.append(`assignmentQuestion[${questionIndex}]`, JSON.stringify(question));

    //   question.questionImages.forEach((image, imageIndex) => {
    //     formData.append(`assignmentQuestion[${questionIndex}].questionImages[${imageIndex}]`, image);
    //   });
    // });

  //  formData.append('assignmentQuestionsData', JSON.stringify(assignmentQuestionsData));

    // Append images
    const assignmentQuestionData = new FormData();
 //   assignmentQuestionData.append('assignmentQuestionData', JSON.stringify(assignmentQuestionsData));
    
    // Construct questionImages data
   // const questionImagesData = new FormData();
    assignmentQuestionsData.assignmentQuestion.forEach((taskQuestion, questionIndex) => {
      taskQuestion.questionImages.forEach((image, imageIndex) => {
        assignmentQuestionData.append(`questionImages[${questionIndex}][${imageIndex}]`, image);
      });
    });
    //  Append taskAttachment and assignmentId as regular fields
    // formData.append('taskAttachment', assignmentQuestionsData.taskAttachment);
    // formData.append('assignmentId', assignmentQuestionsData.assignmentId.toString());

    // Append assignmentQuestion as a JSON string
   // formData.append('assignmentQuestion', JSON.stringify(assignmentQuestionsData.assignmentQuestion));

    // Append questionImages
    // assignmentQuestionsData.assignmentQuestion.forEach((question, questionIndex) => {
    //     question.questionImages.forEach((image, imageIndex) => {
    //         formData.append(`questionImages[${questionIndex}][${imageIndex}]`, image);
    //     });
    // });

    // Loop through questionImages and append images
// assignmentQuestionsData.assignmentQuestion.forEach((question, questionIndex) => {
//   question.questionImages.forEach((image, imageIndex) => {
//     console.log('image',image.name);
    
//     formData.append(`questionImages[${questionIndex}][${imageIndex}]`, image, image.name);
//   });
// });
    // const formData = new FormData();

    // let v = assignmentQuestionsData.assignmentQuestion
    // v.forEach((t) => {
    //   const formData = new FormData();
    //   let r = t.questionImages
    //   r.forEach((e) => {
    //     formData.append('image', e)
    //   })
    //   formData.append('question', JSON.stringify(v))
    //   return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`, formData)
    // })
    //}
    return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`, assignmentQuestionData)
  //  return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`,null)
    // const formData = new FormData();
    // formData.append('assignmentQuestionRequest', JSON.stringify(assignmentQuestionsData));

    // // Append the files to the FormData
    // formData.append('taskAttachment', assignmentQuestionsData.taskAttachment);
    // assignmentQuestionsData.assignmentQuestion.forEach((question, questionIndex) => {
    //   formData.append(`assignmentQuestion[${questionIndex}].question`, question.question);
    //   formData.append(`assignmentQuestion[${questionIndex}].videoUrl`, question.videoUrl);
    //   question.questionImages.forEach((image, imageIndex) => {
    //     formData.append(`assignmentQuestion[${questionIndex}].questionImages[${imageIndex}]`, image);
    //   });
    // });
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data' // Set the correct Content-Type
    // });
    // Send the FormData to the backend
    // return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`, formData,{ headers });
   console.log(assignmentQuestionsData);
   return this.http.post(`${this.assignmentUrl}/addQuestionInAssignment`,assignmentQuestionsData)
  }

  //This Method for Student Uses
  public getAllAssignments() {
    return this.http.get(`${this.assignmentUrl}/getAllAssignments`);
  }

  public getAssignmentQuestionById(questionId: number,assignmentId:number) {
    return this.http.get(`${this.assignmentUrl}/getAssignmentQuesById?questionId=${questionId}&assignmentId=${assignmentId}`)
  }

  public getSubmitedAssignmetByStudentId(studentId:number){
    return this.http.get(`${this.assignmentUrl}/getSubmitedAssignmetByStudentId?studentId=${studentId}`);
  }

  //This Method for Admin Uses
  public getAllSubmitedAssignments() {
    return this.http.get(`${this.assignmentUrl}/getAllSubmitedAssginments`);
  }

  public updateSubmitAssignmentStatus(submissionId: number, status: string , review: string) {
    const formData = new FormData();
    formData.append('submissionId',submissionId.toString());
    formData.append('status',status);
    formData.append('review',review);
    return this.http.put(`${this.assignmentUrl}/updateSubmitedAssignmentStatus`,formData);
  }

  // public getAssignment(id: number) {
  //   return this.http.get(`${this.assignmentUrl}/getAssignment/` + id)
  // }

  // public getAllAssignment() {
  //   return this.http.get<any>(`${this.assignmentUrl}/allAssigment`)
  // }
  // public deleteAssignment(id: number) {
  //   this.http.delete<any>(`${this.assignmentUrl}/${id}`)
  // }
  // public updateAssignment() {
  // }

  // public createAssignment(question: string, images: File[]) {
  //   const formData = new FormData();
  //   formData.append('question', question);
  //   for (let i = 0; i < images.length; i++) {
  //     formData.append('images', images[i]);
  //   }
  //   return this.http.post<any>(`${this.assignmentUrl}/createAssignment`, formData);

  // }

}