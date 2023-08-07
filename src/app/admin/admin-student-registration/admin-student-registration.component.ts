import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';
import { FormBuilder } from '@angular/forms'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-student-registration',
  templateUrl: './admin-student-registration.component.html',
  styleUrls: ['./admin-student-registration.component.scss']
})
export class AdminStudentRegistrationComponent {

  registrationDetails: StudentDetails = new StudentDetails;
  personlaDetailsForm: FormGroup;
  inrollmentForm: FormGroup;
  addressForm: FormGroup
  personal: boolean = false
  activeSection: 'personal' | 'inrollment' | 'address' = 'personal';
  form2ProgressBar = 'form_2_progessbar'
  form3ProgressBar = 'form_3_progessbar'

  constructor(private studentService: StudentService, private router: Router, private formBuilder: FormBuilder) {
    this.personlaDetailsForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      fathersName: ['', Validators.required],
      //  mothersName: ['', Validators.required],
      //fathersOccupation: ['', Validators.required],
      //  contactFather: ['', Validators.required],
      contactMother: ['', Validators.required],
      languageKnown: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
    });
    this.inrollmentForm = this.formBuilder.group({
      applyForCourse: ['', Validators.required],
      currentCourse: ['', Validators.required],
      joinDate: ['', Validators.required],
      college: ['', Validators.required],
      currentSem: ['', Validators.required],

    });
    this.addressForm = this.formBuilder.group({
      localAddress: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  isFieldInvalidForpersonlaDetailsForm(fieldName: string): boolean {
    const field = this.personlaDetailsForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
  isFieldInvalidForinrollmentForm(fieldName: string): boolean {
    const field = this.inrollmentForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
  isFieldInvalidForAddressForm(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public personlaDetailsFormSubmition() {
    Object.keys(this.personlaDetailsForm.controls).forEach(key => {
      const control = this.personlaDetailsForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public inrollmentFormSubmition() {
    Object.keys(this.inrollmentForm.controls).forEach(key => {
      const control = this.inrollmentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  public addressFormSubmition() {
    Object.keys(this.addressForm.controls).forEach(key => {
      const control = this.addressForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  submit() {
    if (this.personlaDetailsForm.valid && this.inrollmentForm.valid && this.addressForm.valid)
      this.studentService.registerStudent(this.registrationDetails).subscribe(
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
            title: 'Registration success !!'
          }).then(e => {
            this.registrationDetails = new StudentDetails
            this.router.navigate(['/admin/student']);
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

  moveToNextSection(): void {
    if (this.activeSection === 'personal') {
      this.personlaDetailsFormSubmition()
      if (this.personlaDetailsForm.valid) {
        this.activeSection = 'inrollment';
        this.form2ProgressBar = 'form_2_progessbar tab_active'
      }
    } else if (this.activeSection === 'inrollment') {
      this.inrollmentFormSubmition()
      if (this.inrollmentForm.valid) {
        this.activeSection = 'address';
        this.form3ProgressBar = 'form_3_progessbar tab_active'
      }
    }
  }
  moveToPreviousSection(): void {
    if (this.activeSection === 'inrollment') {
      this.activeSection = 'personal';
      this.form2ProgressBar = 'form_1_progessbar'
    } else if (this.activeSection === 'address') {
      this.activeSection = 'inrollment';
      this.form3ProgressBar = 'form_2_progessbar'
    }
  }
}
