import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectResponse } from 'src/app/payload/subject-response';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent implements OnInit{
 
  techImages:TechnologyStack[] = [];
  chapter:Chapter[]=[]
  subjects:SubjectResponse[] = [];
  subjectData = {
    imageId:'',
    subjectName:''
  };

  subject:Subject = new Subject();

  constructor(private techService:TechnologyStackService,private subjectService:SubjectService){}

  ngOnInit(): void {
    this.techService.getAllTechnologyStack().subscribe({
      next:(data)=>{
        this.techImages = data
      }
    });

    this.subjectService.getAllSubjects().subscribe({
      next:(data:any)=>{
        console.log(data);
        this.subjects = data;
      }
    })
  }

  public saveSubject(){
    this.subjectService.saveSubject(this.subjectData).subscribe({
      next:(data)=>{
        console.log(data);
      }
    })
  }

  public getSubjectById(id:number){
    this.subjectService.getSubjectById(id).subscribe({
      next:(data:any)=>{
        this.subject = data.subject
      }
    })
  }

  public updateSubject(){
    this.subjectService.updateSubject(this.subject).subscribe({
      next:(data)=>{
        alert('success');
      }
    })
  }
 
}
