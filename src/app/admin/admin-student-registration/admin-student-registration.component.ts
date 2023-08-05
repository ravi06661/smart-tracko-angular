import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';
import { FormBuilder } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-student-registration',
  templateUrl: './admin-student-registration.component.html',
  styleUrls: ['./admin-student-registration.component.scss']
})
export class AdminStudentRegistrationComponent {

  registrationDetails: StudentDetails = new StudentDetails;
  //registrationForm: any;
  registrationForm!: FormGroup;
  constructor(private studentService: StudentService, private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.createForm();
  }
  createForm(): void {
    this.registrationForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      // dob: ['', Validators.required],
      // fathersName: ['', Validators.required],
      // mothersName: ['', Validators.required],
      // fathersOccupation: [''],
      // contactFather: ['', Validators.required],
      // contactMother: ['', Validators.required],
      // languageKnown: [''],
      // email: ['', [Validators.required, Validators.email]],
      // mobile: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      // Handle invalid form submission
      return;
    }
  }

  public submit() {
    if (!this.registrationForm.invalid) {
      this.studentService.registerStudent(this.registrationDetails).subscribe(
        (data: any) => {
          this.registrationDetails = new StudentDetails

          this.router.navigate(['/admin/student']);
        }
      )
    } else {
      return;
    }
  }
}
