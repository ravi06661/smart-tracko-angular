import { MessageSeenBy } from './../../entity/message-seen-by';
import { error } from 'console';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { CourseRequest } from './../../payload/course-request';
import { Component, OnInit } from '@angular/core';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { Course } from 'src/app/entity/course';
import { SubjectService } from 'src/app/service/subject.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Subject } from 'src/app/entity/subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { F } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {
  imageUrl = this.utilityService.getBaseUrl() + "/file/getImageApi/technologyStackImage/";
  subjects: any[] = [];
  courseRequest: CourseRequest = new CourseRequest();
  selectedSubjectIds: number[] = [];
  techImages: TechnologyStack[] = [];


  message = '';
  messageClass = '';

  courses: Course[] = [];
  totalBatches = 0;
  totalSubjects = 0;
  totalCourses = 0;
  course: Course = new Course();
  courseId: number = 0
  imageName = ''
  selectedSubjects: Subject[] = [];

  addCourseForm: FormGroup;

  constructor(private courseService: CourseServiceService,
    private techService: TechnologyStackService,
    private subjectService: SubjectService,
    private utilityService: UtilityServiceService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.addCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseFees: ['', Validators.required],
      duration: ['', Validators.required],
      subjectIds: ['', Validators.required],
      sortDescription: ['', Validators.required],
      isStarterCourse: ['', Validators.required],
    });
  }



  ngOnInit(): void {
    this.getAllCourses();
    this.getAllTechImages();
    this.getAllSubjects();
  }

  checkboxChanged(subjectId: number) {
    const index = this.courseRequest.subjectIds.indexOf(subjectId);

    if (index === -1) {
      this.courseRequest.subjectIds.push(subjectId);
    } else {
      this.courseRequest.subjectIds.splice(index, 1);
    }
  }


  isFieldInvalidForAddCourseDetailsForm(fieldName: string): boolean {
    const field = this.addCourseForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  public courseDetailsFormSubmition() {
    Object.keys(this.addCourseForm.controls).forEach(key => {
      const control = this.addCourseForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public saveCourse() {
     this.addCourseForm.markAllAsTouched();
     if (this.addCourseForm.invalid && this.imageName == '')
      return;

      this.courseService.saveCourse(this.courseRequest).subscribe({
        next: (data: any) => {
          this.message = data.message
            this.getAllCourses();
            this.courseRequest = new CourseRequest();
            this.message = data.message
            this.messageClass = 'text-success'
            this.clearValidationForm();
        },
        error:(err:any) => {
          this.message = err.error.message
          this.messageClass = 'text-danger'
        }
      })
  }

  public getAllCourses() {
    this.courseService.getAllCourses(0, 10).subscribe({
      next: (data: any) => {
        this.courses = data.response;
        this.totalCourses = this.courses.length
      }
    });
  }

  public getAllTechImages() {
    this.techService.getAllTechnologyStack().subscribe({
      next: (data: any) => {
        this.techImages = data
      }
    });
  }

  public getAllSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data: any) => {
        this.subjects = data;
      }
    });
  }

  public getCourseById(id: number) {
    this.courseService.getCourseByCourseId(id).subscribe({
      next: (data: any) => {
        this.course = data
        this.selectedSubjects = this.course.subjects
        this.totalBatches = this.course.batches.length
        this.totalSubjects = this.course.subjects.length
      }
    })
  }

  public updateCourse() {
    this.courseService.updatCourse(this.course).subscribe({
      next: (data: any) => {
        this.course = new Course()
        this.getAllCourses();
        this.message = data.message;
        this.messageClass = 'text-success';
      },
      error:(err:any)=>{
        this.message = err.error.message;
        this.messageClass = 'text-danger';
      }
    })
  }

  public deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe({
      next: (data: any) => {
        this.getAllCourses();
      }
    })
  }

  public checkSubjectInCourse(id: number) {
    if (this.course.subjects.find(e => e.subjectId == id))
      return true
    return false;
  }

  public addAndRemoveSubjectsFromCourse(subject: any) {
    let index = this.course.subjects.findIndex(e => e.subjectId == subject.subjectId);
    if (index === -1)
      this.course.subjects.push(subject);
    else
      this.course.subjects.splice(index, 1);
  }
  public clearValidationForm(){
    this.imageName = '';
    this.addCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseFees: ['', Validators.required],
      duration: ['', Validators.required],
      subjectIds: ['', Validators.required],
      sortDescription: ['', Validators.required],
      isStarterCourse: ['', Validators.required],
    })
  }
 

}
