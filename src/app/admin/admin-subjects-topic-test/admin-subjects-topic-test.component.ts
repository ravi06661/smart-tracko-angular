import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { relativeTimeThreshold } from 'moment';
import { Chapter } from 'src/app/entity/chapter';
import { ChapterContent } from 'src/app/entity/chapter-content';
import { Subject } from 'src/app/entity/subject';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-admin-subjects-topic-test',
  templateUrl: './admin-subjects-topic-test.component.html',
  styleUrls: ['./admin-subjects-topic-test.component.scss']
})
export class AdminSubjectsTopicTestComponent {
  questionId:number =0;
  chapter: ChapterContent[] = []
  chapterId: string = '';
  constructor(private chapterService: ChapterServiceService, private route: ActivatedRoute, private questionService: QuestionServiceService) { }
  ngOnInit() {
    this.getChapter();
  }
  public getChapter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chapterId = id;
      this.chapterService.getChapterById(parseInt(id)).subscribe(
        (data) => {
          this.chapter = data.chapterContent;
        }
      )
    }
  }
}
