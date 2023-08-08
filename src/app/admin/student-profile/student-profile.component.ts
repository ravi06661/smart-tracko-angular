import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.updateStudent(this.student).subscribe({
          next:(res:any)=>{
           this.student=res
          }
          })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        this.getStudentProfileData()
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}
