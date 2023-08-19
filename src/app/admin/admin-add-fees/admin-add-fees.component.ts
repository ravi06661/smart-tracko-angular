import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { Fees } from 'src/app/entity/fees';
import { StudentDetails } from 'src/app/entity/student-details';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { FeesService } from 'src/app/service/fees.service';
import { StudentService } from 'src/app/service/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-fees',
  templateUrl: './admin-add-fees.component.html',
  styleUrls: ['./admin-add-fees.component.scss']
})
export class AdminAddFeesComponent implements OnInit {

  student: StudentDetails[] = []
  course:Course[]=[]
  // autofillForm: FormGroup;
  fees:Fees=new Fees();

  constructor(private studentService: StudentService, private fb: FormBuilder,private feesService:FeesService,private router: Router,private courseService:CourseServiceService) {
    // this.autofillForm = this.fb.group({
    //   // // studentId: new FormControl(''),
    //   // fullName: new FormControl(''),
    //   // email: new FormControl(''),
    //   // mobile: new FormControl(''),
    //   // // other form controls...
    //   // studentId: ['']
    // });
    // this.form = this.fb.group({
    //   studentId: ['']
    // });

    // this.form.get('studentId')?.valueChanges.subscribe(selectedStudentId => {
    //   console.log(selectedStudentId);
    // });
  }

  ngOnInit(): void {

    this.studentService.allStudent().subscribe({
      next: (data: any) => {
        this.student = data
      }
    })
    this.courseService.getAll().subscribe({
      next: (data: any) => {
        this.course = data
      }
    })
  }

  // public getStudent(id: number) {


  // }
  onStudentChange(event: any) {
    const selectedStudentId = event.target.value;
    this.studentService.getByStudentById(selectedStudentId).subscribe(
      (data: any) => {
        this.fees.student.studentId = data.studentId;
        this.fees.student.email = data.email;
        this.fees.student.mobile = data.mobile;
        this.fees.student.fullName = data.fullName;



      }
    )
  }
  onCourseChange(event:any){

    const selectedCourseId=event.target.value;
    this.courseService.getCourseByCourseId(selectedCourseId).subscribe(
    (data:any)=>{
      this.fees.course.courseId=data.courseId;
      this.fees.course.courseFees=data.courseFees;
     
     

    }
    )
  }

  addFees(){
    this.feesService.addStudentFees(this.fees).subscribe(
      (data: any) => {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'success',
          title: 'Fees Add success !!'
        }).then(e => {
          this.fees = new Fees
          this.router.navigate(['/admin/fees']);
        })
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'error',
          title: 'Registration failed !!'
        })
      }
    )
}

}




