import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error } from 'console';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-admin-subjects-chapter',
  templateUrl: './admin-subjects-chapter.component.html',
  styleUrls: ['./admin-subjects-chapter.component.scss']
})
export class AdminSubjectsChapterComponent {
  chapter: Chapter[] = []
  subjects: Subject[] = [];
  subjectId: number = 0;
  chapterName: string = ''
  message: string = '';
  chapterId = 0;
  chapterUpdate: Chapter = new Chapter();
  constructor(private subjectService: SubjectService, private route: ActivatedRoute, private chapterService: ChapterServiceService) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params[('id')];
    this.getAllSubjectChapter();
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
      (error) => {
        this.message = 'Failed..'
      },
      (data) => {
        this.message = 'Success..';
        this.chapterUpdate = new Chapter();
        this.getAllSubjectChapter();
      }
    )
  }
  public deleteChapter() {
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
