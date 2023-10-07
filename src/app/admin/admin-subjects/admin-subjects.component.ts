import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { an } from '@fullcalendar/core/internal-common';
import { log } from 'console';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/'
  techUrl = this.BASE_URL + "/file/getImageApi/technologyStackImage/";
  techImages: TechnologyStack[] = [];
  chapter: Chapter[] = []
  subjects: SubjectResponse[] = [];
  subjectData = {
    imageId: 0,
    subjectName: ''
  };
  message: string = ''
  subject: Subject = new Subject();
  subjectId: number = 0;
  imageName = ''
  subjectSubmissionForm: FormGroup;

  closeSubmiteButton: boolean = false
  constructor(private techService: TechnologyStackService,
    private subjectService: SubjectService,
    private utilityService: UtilityServiceService
    , private formBuilder: FormBuilder,
    private router: Router) {
    this.subjectSubmissionForm = this.formBuilder.group({
      subjectName: ['', Validators.required]
    });


  }

  ngOnInit(): void {
    this.message = ''
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });
    this.getAllSubject();
  }

  public getAllSubject() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data: any) => {
        this.subjects = data;
      }
    })
  }

  public saveSubject() {
    if (this.subjectSubmissionForm.invalid && this.imageName == '') {
      this.submissionFormFun()
      return;
    } else {
      this.subjectService.saveSubject(this.subjectData).subscribe(
        {
          next: (data: any) => {
            this.clearFormSubmission()
            this.subjectData = {
              imageId: 0,
              subjectName: ''
            };
            this.closeSubmiteButton = true
            Swal.fire('Subject Added Successfully').then(e => {
              this.router.navigate(['/admin/subject'])
            })
            this.getAllSubject()
          },
          error: (error) => {
            this.message = error.error.message
          }
        }
      )
    }
  }

  public getSubjectById(id: number) {
    this.subjectService.getSubjectById(id).subscribe({
      next: (data: any) => {
        this.subject = data.subject
      }
    })
  }

  public updateSubject() {
    this.subjectService.updateSubject(this.subject).subscribe({
      next: (data: any) => {
        this.message = "Success.";
        this.subjects = this.subjects.map(item => (item.subjectId === data.subjectId ? data : item));
      },
      error:(err)=>{
        this.message = err.error.message
      }
    })
  }

  public reloadMessage() {
    this.message = ''
  }

  setSubjectId(id: number) {
    this.subjectId = id;
  }
  public deleteSubect() {
    this.subjectService.deleteSubjectById(this.subjectId).subscribe(
      (data: any) => {
        this.getAllSubject();
        this.subjectId = 0;
      }
    )
  }

  public clearFormSubmission() {
    this.subjectSubmissionForm = this.formBuilder.group({
      subjectName: ['', Validators.required]
    });
  }
  public isFieldInvalidForSubmissionForm(fieldName: string): boolean {
    const field = this.subjectSubmissionForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
  public submissionFormFun() {
    Object.keys(this.subjectSubmissionForm.controls).forEach(key => {
      const control = this.subjectSubmissionForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

}
