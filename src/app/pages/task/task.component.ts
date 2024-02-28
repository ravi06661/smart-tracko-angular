import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { AfterViewInit, Component } from '@angular/core';
import { Task } from 'src/app/entity/task';
import { LoginService } from 'src/app/service/login.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { DatePipe } from '@angular/common';
import { PaginationManager } from 'src/app/entity/pagination-manager';
import { PageRequest } from 'src/app/payload/page-request';
import { s } from '@fullcalendar/core/internal-common';
import { TaskRequest } from 'src/app/payload/task-request';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements AfterViewInit {
  tasks: Task[] = []
  taskSubmissionList: StudentTaskSubmittion[] = []
  taskSubmissionList2: StudentTaskSubmittion[] = []
  taskSubmissionObj: StudentTaskSubmittion = new StudentTaskSubmittion

  // for task submission
  submissioTaskpageManager: PaginationManager = new PaginationManager();
  submissioTaskPageRequest: PageRequest = new PageRequest();

  // for task
  TaskpageManager: PaginationManager = new PaginationManager();
  TaskPageRequest: PageRequest = new PageRequest();

  constructor(private taskService: TaskServiceService,
    private loginService: LoginService,
    private datePipe: DatePipe) { }


  ngOnInit() {
    this.getAllTask();
    this.getSubmitedTaskByStudent('');
  }



  ngAfterViewInit(): void {
    let element = document.getElementById('status1');
    element!.innerText = 'All'
  }
  status: any
  public getSubmitedTaskByStudent(status: string) {
    this.status = status;
    let element = document.getElementById('status1');
    element!.innerText = status?status :'ALL'
    this.taskService.getSubmitedTaskByStudent(this.loginService.getStudentId(), this.submissioTaskPageRequest, status?status:'').subscribe({
      next: (data: any) => {
        this.taskSubmissionList = data.content
        this.taskSubmissionList2 = data.content
        this.submissioTaskpageManager.setPageData(data)
        this.submissioTaskPageRequest.pageNumber = data.pageable.pageNumber
      }
    })
  }


  public submissionManageNextPrev(isNext: boolean) {
    let i = 0;
    if (isNext) i = this.submissioTaskPageRequest.pageNumber + 1;
    else i = this.submissioTaskPageRequest.pageNumber - 1;
    if (i >= 0 && i < this.submissioTaskpageManager.totalPages)
      this.submissionPage(i);
  }
  submissionPage(pageNumber: any) {
    if (pageNumber !== this.submissioTaskPageRequest.pageNumber) {
      this.submissioTaskPageRequest.pageNumber = pageNumber;
      this.getSubmitedTaskByStudent(this.status)
    }
  }
  taskIndexing: number = 0
  public getAllTask() {
    this.taskService.getAllTask(this.loginService.getStudentId(), this.TaskPageRequest).subscribe(
      (data: any) => {
        this.tasks = data.allTask.content
        this.TaskpageManager.setPageData(data.allTask)
        this.taskIndexing = data.allTask.pageable.pageSize * data.allTask.pageable.pageNumber + 1
        this.TaskPageRequest.pageNumber = data.allTask.pageable.pageNumber
      }
    )
  }

  
  public taskManageNextPrev(isNext:any) {
    //: boolean = event
    console.log(isNext);
    let i = 0;
    if (isNext) i = this.TaskPageRequest.pageNumber + 1;
    else i = this.TaskPageRequest.pageNumber - 1;
    if (i >= 0 && i < this.TaskpageManager.totalPages)
      this.taskPage(i);
  }
  taskPage(pageNumber: any) {
    if (pageNumber !== this.TaskPageRequest.pageNumber) {
      this.TaskPageRequest.pageNumber = pageNumber;
      this.getAllTask()
    }
  }

  todayDate: Date = new Date()
  public dateFormatter(date: Date) {
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }
}
