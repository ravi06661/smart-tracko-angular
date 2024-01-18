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
import { Coursereponse } from 'src/app/payload/coursereponse';
import { isThisISOWeek } from 'date-fns';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {
  imageUrl = this.utilityService.getBaseUrl() + "/file/getImageApi/technologyStackImage/";
  subjects: any[] = [];
  courseRequest: CourseRequest = new CourseRequest();
  courseUpdate: CourseRequest = new CourseRequest();
  selectedSubjectIds: number[] = [];
  techImages: TechnologyStack[] = [];

  courseResponse: Coursereponse[] = []
  courseResponse1 = new Coursereponse()

  // obj = {
  //   tech: new TechnologyStack(),
  //   subject: [],
  //   courseName: '',
  //   courseFees: 0,
  //   courseDuration: 0,
  //   isStarter: false,
  //   description: ''
  // }
  // courseRequest:CourseRequest =  new CourseRequest()

  message = '';
  messageClass = '';

  //courses: Course[] = [];
  totalBatches = 0;
  totalSubjects = 0;
  totalCourses = 0;
  course: Course = new Course();
  courseId: number = 0
  imageName: string | undefined
  //selectedSubjects: Subject[] = [];

  courseresponseobj: Coursereponse = new Coursereponse()

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
      error: (err: any) => {
        this.message = err.error.message
        this.messageClass = 'text-danger'
      }
    })
  }

  public getAllCourses() {
    this.courseService.getAllCourses(0, 10).subscribe({
      next: (data: any) => {
        this.courseResponse = data.response;
        this.totalCourses = this.courseResponse.length
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
        this.courseResponse1 = data
      }
    })

  }

  public updateCourse() {

    this.courseUpdate.courseId=this.courseResponse1.courseId
    this.courseUpdate.courseFees = this.courseResponse1.courseFees
    this.courseUpdate.courseName = this.courseResponse1.courseName
    this.courseUpdate.duration = this.courseResponse1.duration
    this.courseUpdate.sortDescription = this.courseResponse1.sortDescription
    this.courseUpdate.isStarterCourse = this.courseResponse1.isStarterCourse
    this.courseUpdate.technologyStack = this.courseResponse1.technologyStack.id
    this.courseUpdate.subjectIds = this.courseResponse1.subjectResponse.map(obj => obj.subjectId) as number[]
   


    this.courseService.updatCourse(this.courseUpdate).subscribe({
      next: (data: any) => {
        this.courseRequest = new CourseRequest()
       this.getAllCourses();
        this.message = data.message;
        this.messageClass = 'text-success';
      },
      error: (err: any) => {
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
    if (this.courseResponse1.subjectResponse.find(e => e.subjectId == id))
      return true
    return false;
  }


  // public addAndRemoveSubjectsFromCourse(subject: any) {
  //   let index = this.course.subjects.findIndex(e => e.subjectId == subject.subjectId);
  //   if (index === -1)
  //     this.course.subjects.push(subject);
  //   else
  //     this.course.subjects.splice(index, 1);
  // }

  public addAndRemoveSubjectsFromCourse(subject: any) {
    let index = this.courseResponse1.subjectResponse.findIndex(e => e.subjectId == subject.subjectId);
    if (index === -1) {
      this.courseResponse1.subjectResponse.push(subject);
    } else {
      this.courseResponse1.subjectResponse.splice(index, 1);
    }
  }

  public clearValidationForm() {
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


  openModal() {
    const modal = document.getElementById('course-add-modal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  // Function to close the modal
  closeModal() {
    const modal = document.getElementById('course-add-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }


}
