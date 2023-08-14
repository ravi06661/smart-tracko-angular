import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent implements OnInit{
 
  techImages:TechnologyStack[] = [];
  subjects:Subject[] = [];
  subjectData = {
    imageId:'',
    subjectName:''
  }

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
}
