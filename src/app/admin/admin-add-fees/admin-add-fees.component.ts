import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { Fees } from 'src/app/entity/fees';
import { StudentDetails } from 'src/app/entity/student-details';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { FeesService } from 'src/app/service/fees.service';
import { StudentService } from 'src/app/service/student.service';
import Swal from 'sweetalert2';
import { Directive, ElementRef, HostListener } from '@angular/core';
 

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
  feesPayDetails: FormGroup ;

  constructor(private studentService: StudentService, private fb: FormBuilder,private feesService:FeesService,private router: Router,private courseService:CourseServiceService,private formBuilder: FormBuilder,private el: ElementRef) {
    this.feesPayDetails = this.formBuilder.group({
      fullName: ['', Validators.required],
      studentId: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      courseName: ['', Validators.required],
      courseFees: ['', Validators.required],
      finalFees: ['', Validators.required],
      date: ['', Validators.required],

    });
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this.el.nativeElement.value = this.removeLeadingZeros(value);
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

//   addFees(){
//     this.fees.finalFees = Number(this.removeLeadingZeros(String(this.fees.finalFees)));
//     this.feesService.addStudentFees(this.fees).subscribe(
//       (data: any) => {

//         const Toast = Swal.mixin({
//           toast: true,
//           position: 'top-end',
//           showConfirmButton: false,
//           timer: 1500,
//           timerProgressBar: true,
//         })
//         Toast.fire({
//           icon: 'success',
//           title: 'Fees Add success !!'
//         }).then(e => {
//           this.fees = new Fees
//           this.router.navigate(['/admin/fees']);
//         })
//       },
//       (err) => {
//         const Toast = Swal.mixin({
//           toast: true,
//           position: 'top-end',
//           showConfirmButton: false,
//           timer: 1500,
//           timerProgressBar: true,
//         })
//         Toast.fire({
//           icon: 'error',
//           title: 'Registration failed !!'
//         })
//       }
//     )
// }
addFees() {
  
  this.feesPayDetails.markAllAsTouched();
    if (this.feesPayDetails.valid )
  this.fees.finalFees = Number(this.removeLeadingZeros(String(this.fees.finalFees)));

  if (isNaN(this.fees.finalFees)) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: 'error',
      title: 'Invalid Final Fees. Please enter a valid number.',
    });
    return; 
  }

  this.feesService.addStudentFees(this.fees).subscribe(
    (data: any) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: 'Fees Add success !!',
      }).then(e => {
        this.fees = new Fees();
        this.router.navigate(['/admin/fees']);
      });
    },
    (err) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'error',
        title: 'This Student is Already Registration !!',
      });
    }
  );
}




isFieldInvalidForfeesPayDetailsForm(fieldName: string): boolean {
  const field = this.feesPayDetails.get(fieldName);
  return field ? field.invalid && field.touched : false;
}

public feesDetailsFormSubmition() {
  Object.keys(this.feesPayDetails.controls).forEach(key => {
    const control = this.feesPayDetails.get(key);
    if (control) {
      control.markAsTouched();
    }
  });
  const firstInvalidControl = document.querySelector('input.ng-invalid');
  if (firstInvalidControl) {
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

removeLeadingZeros(value: string): string {
  // Remove leading zeros before the decimal point
  const [integerPart, decimalPart] = value.split('.');
  const integerPartWithoutZeros = integerPart.replace(/^0+/, '');

  // Reconstruct the number with or without the decimal part
  if (decimalPart !== undefined) {
    return `${integerPartWithoutZeros}.${decimalPart}`;
  } else {
    return integerPartWithoutZeros;
  }
}



}
