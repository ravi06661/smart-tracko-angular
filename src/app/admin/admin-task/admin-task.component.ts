import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { Task } from 'src/app/entity/task';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';

@Component({
  selector: 'app-admin-task',
  templateUrl: './admin-task.component.html',
  styleUrls: ['./admin-task.component.scss']
})
export class AdminTaskComponent {
  task: TaskRequest = new TaskRequest()
  subjects: Subject[] = []
  courses: Course[] = []
  constructor(private subjectService: SubjectService, private courseService: CourseServiceService, private taskService: TaskServiceService, private router: Router) { }
  ngOnInit() {
    this.getCourses();
  }
  public getCourses() {

    this.courseService.getAll().subscribe(
      (data: any) => {
        this.courses = data
      }
    )
  }
  public getSubjects() {
    this.subjects = this.task.course.subjects
  }
  submit() {

    this.taskService.addTask(this.task).subscribe(
      (data: any) => {
        console.log(data);
        this.router.navigate(['/admin/createtask/' + data.taskId])
      }
    )
    // this.router.navigate(['/admin/createtask/'])
  }
}
