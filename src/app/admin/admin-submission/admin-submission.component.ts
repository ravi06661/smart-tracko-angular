import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { ToastService } from 'src/app/service/toast.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
declare let Swiper: any;
@Component({
  selector: 'app-admin-submission',
  templateUrl: './admin-submission.component.html',
  styleUrls: ['./admin-submission.component.scss']
})
export class AdminSubmissionComponent implements OnInit, AfterViewInit {

  status = 'Unreviewed';
  review = ''
  id!: number
  submitedTask: StudentTaskSubmittion = new StudentTaskSubmittion

  constructor(private taskService: TaskServiceService,
    private activateRoute: ActivatedRoute,) { }

  async ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      this.id = params['submissionId'];
    });

    try {
      const data = await this.getTaskSubmission();

      if (this.submitedTask.status == this.status) {
        this.updateSubmitedTaskStatus('Reviewing');
      }
    } catch (error: any) {
      //  this.toast.showError(error.message, 'Error');
    }
  }

  public async getTaskSubmission() {
    try {
      const data: any = await this.taskService.getSubmissionTaskById(this.id).toPromise();
      this.submitedTask = data.submission;
      return data;
    } catch (error) {
      throw error;
    }
  }

  //   this.id = this.activateRoute.snapshot.params['id']
  //   this.getTaskSubmission().then(() => {
  //     if (this.submitedTask.status == this.status) {
  //       this.updateSubmitedTaskStatus('Reviewing')
  //     }
  //   })

  // }

  // public async getTaskSubmission() {
  //  return  await this.taskService.getSubmissionTaskById(this.id).subscribe({
  //     next: (data: any) => {
  //         this.submitedTask = data.submission
  //         // if (this.submitedTask.status == this.status) {
  //         //   this.updateSubmitedTaskStatus('Reviewing')
  //         // }
  //     },
  //     error: (er: any) => {
  //      this.toast.showError(er.error.message,'Error') 
  //     }
  //   })

  // }

  public updateSubmitedTaskStatus(status: string) {
    this.taskService.updateSubmitedTaskStatus(this.id.toString(), status, this.review).subscribe({
      next: (data: any) => {
        this.submitedTask = data;
      }
    })
  }

  ngAfterViewInit() {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      // spaceBetween: 50,
      loop: true,
      grabCursor: true,
      centeredSlides: true,

      navigation: {
        nextEl: ".next",
        prevEl: ".prev"
      },
    });

  }
}
