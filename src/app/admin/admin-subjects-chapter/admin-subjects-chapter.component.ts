import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-admin-subjects-chapter',
  templateUrl: './admin-subjects-chapter.component.html',
  styleUrls: ['./admin-subjects-chapter.component.scss']
})
export class AdminSubjectsChapterComponent {
  chapter: Chapter[] = []
  subjects: Subject[] = [];
  constructor(private subjectService: SubjectService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.getAllSubjectChapter();
  }
  public getAllSubjectChapter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.subjectService.getAllSubjectChapters(parseInt(id)).subscribe(
        (data: any) => {
          this.chapter = data;
        }
      )
    }
  }
}
