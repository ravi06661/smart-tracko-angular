import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-admin-add-fees',
  templateUrl: './admin-add-fees.component.html',
  styleUrls: ['./admin-add-fees.component.scss']
})
export class AdminAddFeesComponent implements OnInit{

  student:StudentDetails[]=[]
  autofillForm: FormGroup ;

  constructor(private studentService:StudentService,private fb: FormBuilder){
    this.autofillForm = this.fb.group({
      studentId: new FormControl(''),
      fullName: new FormControl(''),
      email: new FormControl(''),
      mobile: new FormControl(''),
      // other form controls...
    });
  }

  ngOnInit(): void {
    
    this.studentService.allStudent().subscribe({
      next:(data:any)=>{
        this.student=data
      }
    })
  }

 public getStudent(): void{
  const studentId = this.autofillForm.get('studentId')?.value;
  this.studentService.getByStudentById(studentId).subscribe((data:any) => {
    this.autofillForm.patchValue({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      // update other form fields...
    });
  });
}
  }

 



