import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { AppUtils } from 'src/app/utils/app-utils';

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
  subject: SubjectResponse = new SubjectResponse
  subjectId: number = 0;
  imageName = ''
  subjectSubmissionForm: FormGroup;
  subjectIndex = 0;
  constructor(private techService: TechnologyStackService,
    private subjectService: SubjectService,
    private utilityService: UtilityServiceService
    , private formBuilder: FormBuilder,
    private router: Router,
    private toast: ToastService) {
    this.subjectSubmissionForm = this.formBuilder.group({
      subjectName: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.message = ''

    this.getAllSubject();
  }

  public getAllSubject() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data: any) => {
        this.subjects = data;
      }
    })
  }

  public getAllTechImage() {
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });
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
            this.subjects.push(data.subject)
            this.toast.showSuccess('Subject Added Successfully!!', 'Success')
            AppUtils.modelDismiss('subject-model-close');
          },
          error: (error) => {
            this.toast.showError(error.error.message, 'Error')
          }
        }
      )
    }
  }

  public getSubjectById(id: number) {
    if (this.techImages.length == 0) {
      this.getAllTechImage();
    }
    this.subject = this.subjects.find(obj => obj.subjectId == id) as SubjectResponse
  }

  public updateSubject() {
    this.subjectService.updateSubject(this.subject).subscribe({
      next: (data: any) => {
        this.subjects = this.subjects.map(item => (item.subjectId == data.subjectId ? data : item));
        AppUtils.modelDismiss('subject-edite-modal-close')
        this.toast.showSuccess("subject update successfully!!", 'Success')
      },
      error: (err) => {
        this.toast.showError(err.error.message, 'Error')
      }
    })
  }

  public reloadMessage() {
    this.message = ''
  }

  public deleteSubect() {
    this.subjectService.deleteSubjectById(this.subjectId).subscribe(

      {
        next: (data: any) => {
          this.subjects.splice(this.subjectIndex, 1)
          this.subjectId = 0;
          this.subjectIndex = 0
          this.toast.showSuccess('Subject deleted successfully', 'Success')

        },
        error: (er: any) => {
          this.toast.showError('Error Occure please try again', 'Error')
        }
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
