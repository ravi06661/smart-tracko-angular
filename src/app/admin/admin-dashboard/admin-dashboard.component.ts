import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
import { StudentDetails } from 'src/app/entity/student-details';
import { UtilityServiceService } from 'src/app/service/utility-service.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{

  students:StudentDetails[] = []
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl= this.BASE_URL+'/file/getImageApi/images/'
  constructor(private elementRef: ElementRef,private localst:LocationStrategy,private studentService:StudentService,private utilityService:UtilityServiceService) {}

  ngOnInit(): void {
    this.preventBackButton();
    this.getNewRegistrationStudents();
  }

  public preventBackButton(){
    history.pushState(null,'',location.href);
    this.localst.onPopState(()=>{
      history.pushState(null,'',location.href);
    });
  }

  public getNewRegistrationStudents(){
    this.studentService.getAllStudent(0,15).subscribe({
      next:(data:any)=>{
        this.students = data.response;
      }
    })
  }


}
