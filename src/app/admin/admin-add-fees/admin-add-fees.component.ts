import { Component, OnInit } from '@angular/core';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-admin-add-fees',
  templateUrl: './admin-add-fees.component.html',
  styleUrls: ['./admin-add-fees.component.scss']
})
export class AdminAddFeesComponent implements OnInit{

  student:StudentDetails[]=[]
  constructor(private studentService:StudentService){}
  ngOnInit(): void {
    
    this.allStudent();
  }

  public allStudent(){
    this.studentService.allStudent().subscribe({
      next:(data:any)=>{
        this.student=data
      }
    })
  }
}
