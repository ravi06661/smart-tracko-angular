import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilityServiceService } from './utility-service.service';
import { Profile } from '../entity/profile';
import { AssignmentRequest } from '../payload/assignment-request';
import { retry } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AssignmentServiceService {

  BASE_URL = this.utilityService.getBaseUrl();
  assignmentUrl = this.BASE_URL + '/assignment';
  
  constructor(private http: HttpClient, private utilityService: UtilityServiceService) { }


  public createAssignment(assignmentRequest:AssignmentRequest){
    return this.http.post(`${this.assignmentUrl}/createAssignment`,assignmentRequest);
  }

  public  getAssignmentById(assignmentId: number) {
    return this.http.get(`${this.assignmentUrl}/getAssignmentById?assignmentId=${assignmentId}`);
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