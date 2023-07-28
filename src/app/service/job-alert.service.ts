import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JobAlert } from '../entity/job-alert';
import { UtilityServiceService } from './utility-service.service';
@Injectable({
  providedIn: 'root'
})
export class JobAlertService {
  BASE_URL=this.utilityService.getBaseUrl();
  jobUrl=this.BASE_URL+'/job';

  constructor(private http: HttpClient,private utilityService:UtilityServiceService) { }


  addJob(data: JobAlert) {

    var formData = new FormData();
    formData.append('jobTitle', data.jobTitle)
    formData.append('experienceRequired', data.experienceRequired)
    formData.append('jobDescription', data.jobDescription)
    formData.append('technicalSkills', data.technicalSkills)
    formData.append('type', data.type)
    formData.append('jobPackage', data.jobPackage)
    formData.append('companyName', data.companyName)
    formData.append('technologyStackId', (data.technologyStack.id).toString())
    return this.http.post<JobAlert>(`${this.jobUrl}/createJobApi`, formData)
  }
  getInternShipJobs(page: number, size: number) {
    return this.http.get<JobAlert[]>(`${this.jobUrl}/getAllJobsApi?type=INTERN&page=${page}&size=${size}`)
  }
  getAllJobs(page: Number, size: number) {
    var formData = new FormData();
    formData.append('type', "Jobs")
    return this.http.get<JobAlert[]>(`${this.jobUrl}/getAllJobsApi?type=JOB&page=${page}&size=${size}`)
  }
  getAllJobsAndIntership(page: Number, size: number) {
    return this.http.get<JobAlert[]>(`${this.jobUrl}/getAllJobsAndIntershipApi?type=JOB&page=${page}&size=${size}`)
  }
  activeJob(id: number) {
    return this.http.put<JobAlert>(`${this.jobUrl}/activeJobApi?jobId=${id}`, null);
  }
  delete(id: number) {
    return this.http.delete(`${this.jobUrl}/deleteJobApi?jobId=${id}`)
  }
  
  searchJobs(data: any, role: string) {

    let params = new HttpParams()
    params = params.append('field', data)
    if (role == "student") {
      params = params.append("role", "student")
    }
    if (role == "admin") {
      params = params.append("role", "admin")
    }
    return this.http.get<JobAlert[]>(`${this.jobUrl}/searchJobApi`, { params })
  }
}
