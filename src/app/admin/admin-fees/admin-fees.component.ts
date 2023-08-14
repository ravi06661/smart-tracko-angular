import { Component } from '@angular/core';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-admin-fees',
  templateUrl: './admin-fees.component.html',
  styleUrls: ['./admin-fees.component.scss']
})
export class AdminFeesComponent {
  student:StudentDetails=new StudentDetails();
  constructor(private studentService:StudentService){}

  public allStudent(){
    this.studentService.allStudent().subscribe({
      next:(data:any)=>{
        this.student=data
      }
    })
  }

}
