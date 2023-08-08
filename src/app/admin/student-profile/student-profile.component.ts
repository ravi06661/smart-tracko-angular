import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit{

  BASE_URL=this.utilityService.getBaseUrl();  
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  studentId:number=0;
  student:StudentDetails=new StudentDetails();

  constructor(private utilityService:UtilityServiceService,private activateRoute:ActivatedRoute,private studentService:StudentService){}
  ngOnInit(): void {
    
    this.studentId=this.activateRoute.snapshot.params[('studentId')];
    this.getStudentProfileData();
  }

  public getStudentProfileData(){
    this.studentService.getStudentProfileData(this.studentId).subscribe({
      next:(data:any)=>{
        this.student = data;
      }
    })
  }
  public updateStudent(){
    this.studentService.updateStudent(this.student).subscribe({
   next:(res:any)=>{
    this.student=res
   }
    })
  }
}
