import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error } from 'console';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-subjects-chapter',
  templateUrl: './admin-subjects-chapter.component.html',
  styleUrls: ['./admin-subjects-chapter.component.scss']
})
export class AdminSubjectsChapterComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  techUrl = this.BASE_URL+"/file/getImageApi/technologyStackImage/";
  chapter: Chapter[] = []
  subjects: Subject[] = [];
  subjectId: number = 0;
  chapterName: string = ''
  message: string = '';
  chapterId = 0;
  chapterUpdate: Chapter = new Chapter();
  imageName = ''
  techImages: TechnologyStack[] = [];

  constructor(private subjectService: SubjectService, 
    private route: ActivatedRoute, 
    private chapterService: ChapterServiceService,
    private utilityService:UtilityServiceService,
    private techService: TechnologyStackService) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params[('id')];
    this.getAllSubjectChapter();
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });
  }

  public getAllSubjectChapter() {
    this.subjectService.getAllSubjectChapters(this.subjectId).subscribe(
      (data: any) => {
        this.chapter = data;
      }
    )
  }
  public addChapter() {
    this.chapterService.addChapter(this.subjectId, this.chapterUpdate.chapterName).subscribe(
      {
        next:(data) => {
          this.message = 'Success..';
          this.chapterUpdate = new Chapter();
          this.chapter = data.chapters
        },
        error:(error) => {
          this.message = 'Failed..'
        }
      },
    )
  }
  public deleteChapter() {
     //alert(this.chapterId)
    this.chapterService.deleteChapter(this.chapterId, this.subjectId).subscribe(
      (data) => {
        this.chapterId = 0;
      },
      (error) => {
        this.message = 'Failed..'
      }
    )
  }
  public cancel() {
    this.chapterUpdate = new Chapter();
    this.message = ''
  }
  public reload() {
    this.message = ''
    this.chapterUpdate = new Chapter();
    this.getAllSubjectChapter();
  }

  public updateChapter() {
    this.chapterService.updateChapter(this.chapterId, this.subjectId, this.chapterUpdate.chapterName).subscribe(
      (data) => {
        this.message = 'success';
        this.chapterUpdate = new Chapter();
        this.chapterId=0;
      },
      (error) => {
        this.message = 'Failed..'
      }
    )
  }
  public getChapterById(id:number) {
    this.chapterId=id;
    this.chapterService.getChapterById(id).subscribe(
      (data) => {
        this.chapterUpdate = data;
      },
      (error)=>{
        this.message="error"
      }
    )
  }
}
