import { Component, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { log } from 'console';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

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

  constructor(private techService: TechnologyStackService,
    private subjectService: SubjectService,
    private utilityService: UtilityServiceService) { }

  ngOnInit(): void {
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
    this.subjectService.saveSubject(this.subjectData).subscribe({
      next: (data: any) => {
        this.message = 'Success.'
        this.subjectData = {
          imageId: 0,
          subjectName: ''
        };
        this.getAllSubject();
      }
    })
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
}
