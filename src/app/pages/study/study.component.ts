import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { LoginService } from 'src/app/service/login.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent {
  subjects: SubjectResponse[] = [];
  subject: Subject = new Subject();

  constructor(
    private subjectService: SubjectService,
    private loginService: LoginService
  ) {}

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
    if (num1 > 1 || num2 > 1) {
      per = Math.floor((num1 / num2) * 100);
      let obj = per * 6.25;
      this.progressWidth = obj.toString() + '%';
    } else {
      per = 0;
      this.progressWidth = '0%';
    }
    return per;
  }
}
