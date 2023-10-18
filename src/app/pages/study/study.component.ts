import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { LoginService } from 'src/app/service/login.service';
import { SubjectService } from 'src/app/service/subject.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent {
  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/technologyStackImage/';
  subjects: SubjectResponse[] = [];
  subject: Subject = new Subject();

  constructor(private subjectService: SubjectService,private loginService:LoginService,private utilityService:UtilityServiceService) { }


  ngOnInit() {
    this.subjectService.getAllSubjectsWithChapterCompletedStatus().subscribe({
      next: (data: any) => {
        this.subjects = data;
      },
    });
  }
  progressWidth: string = '';
  calculatePercentages(num1: number, num2: number) {
    let per: any;
      per = Math.floor((num1 / num2) * 100);
      
    return per;
  }
}
