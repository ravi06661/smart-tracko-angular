import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { Chapter } from 'src/app/entity/chapter';
import { Subject } from 'src/app/entity/subject';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { ChapterResponse } from 'src/app/payload/chapter-response';
import { ChapterServiceService } from 'src/app/service/chapter-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
  selector: 'app-admin-subjects-chapter',
  templateUrl: './admin-subjects-chapter.component.html',
  styleUrls: ['./admin-subjects-chapter.component.scss']
})
export class AdminSubjectsChapterComponent {
  BASE_URL = this.utilityService.getBaseUrl();
  techUrl = this.BASE_URL + "/file/getImageApi/technologyStackImage/";
  chapter: Chapter[] = []
  subjects: Subject[] = [];
  subjectId: number = 0;
  chapterName: string = ''
  message: string = '';
  chapterId = 0;
  chapterUpdate: ChapterResponse = new ChapterResponse()

  imageName = ''
  techImages: TechnologyStack[] = [];
  chapterIndex: number = 0;
  chapterResponse: ChapterResponse[] = []

  constructor(private subjectService: SubjectService,
    private route: ActivatedRoute,
    private chapterService: ChapterServiceService,
    private utilityService: UtilityServiceService,
    private techService: TechnologyStackService,
    private router: Router,
    private toast: ToastService) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params[('id')];
    this.getSubjectById(this.subjectId)
    this.techService.getAllTechnologyStack().subscribe({
      next: (data) => {
        this.techImages = data
      }
    });

  }

  public getSubjectById(subjectId: number) {
    this.subjectService.getAllChapterWithSubjectId(subjectId).subscribe({
      next: (data: any) => {
        this.chapterResponse = data.chapters
      }
    })
  }

  public addChapter() {
    if (this.chapterUpdate.chapterName.trim() == '') {
      this.message = "please enter subject name.."
      return;
    } else {
      this.chapterService.addChapter(this.subjectId, this.chapterUpdate.chapterName.trim()).subscribe(
        {
          next: (data: any) => {
            this.chapterUpdate = new ChapterResponse();
            this.chapterResponse.push(data.chapter)
            AppUtils.modelDismiss('chapter-save-modal')
            this.toast.showSuccess('Chapter added successfully!!', 'Success')
          },
          error: (error) => {
            this.toast.showError(error.error.message, 'Error')
          }
        }
      )
    }
  }
  public deleteChapter() {
    this.chapterService.deleteChapter(this.chapterId).subscribe(
      {
        next: (data: any) => {
          this.chapterResponse.splice(this.chapterIndex, 1)
          this.chapterId = 0;
          this.chapterIndex = 0
          this.toast.showSuccess('chapter deleted successfully!!', 'Success')
        },
        error: (error) => {
          this.toast.showError(error.error.message, 'Error')
        }
      }
    )
  }
  public cancel() {
    this.chapterUpdate = new ChapterResponse();
  }
  public reload() {
    this.message = ''
    this.chapterUpdate = new ChapterResponse();
  }

  public updateChapter() {
    this.chapterService.updateChapter(this.chapterId, this.chapterUpdate.chapterName).subscribe(
      {
        next: (data) => {
          let ch = this.chapterResponse.find(obj => obj.chapterId === this.chapterId) as ChapterResponse
          ch.chapterName = this.chapterUpdate.chapterName;
          this.chapterId = this.chapterId;
          ch.chapterId = this.chapterUpdate.chapterId

          AppUtils.modelDismiss('chapter-update-modal')
          this.toast.showSuccess('Chapter updated successfully!!', 'success')
        },
        error: (error) => {
          this.toast.showError(error.error.message,'Error')
        }
      }
    )
  }
  public getChapterById(id: number) {
    this.chapterId = id;
    this.chapterUpdate = this.chapterResponse.find(obj => obj.chapterId == id) as ChapterResponse
  }


  public pageRenderUsingRouterLink(path: string, chapterId: number) {
    const dataParams = {
      subjectId: this.subjectId,
      chapterId: chapterId,
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

}