import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { an } from '@fullcalendar/core/internal-common';
import { Course } from 'src/app/entity/course';
import { Subject } from 'src/app/entity/subject';
import { TaskQuestion } from 'src/app/entity/task-question';
import { TaskRequest } from 'src/app/payload/task-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { SubjectService } from 'src/app/service/subject.service';
import { TaskServiceService } from 'src/app/service/task-service.service';

@Component({
  selector: 'app-admin-create-task',
  templateUrl: './admin-create-task.component.html',
  styleUrls: ['./admin-create-task.component.scss']
})
export class AdminCreateTaskComponent {
  task: TaskRequest = new TaskRequest()
  subjects: Subject[] = []
  courses: Course[] = []
  taskId:number=0;
  question:TaskQuestion = new TaskQuestion()
  public Editor = ClassicEditor;
  constructor(private activateRouter:ActivatedRoute,private subjectService: SubjectService, private courseService: CourseServiceService, private taskService: TaskServiceService, private router: Router) { }
  ngOnInit() {
    this.taskId =this.activateRouter.snapshot.params[('id')]
    this.getTask()
  }

 public getTask(){
  this.taskService.getTaskById(this.taskId).subscribe(
    (data:any)=>{
       this.task = data;
    }
  )
 }

  public getCourses() {

    this.courseService.getAll().subscribe(
      (data: any) => {
        this.courses = data

        console.log(data);
      }
    )
  }
  public getSubjects() {
    this.subjects = this.task.course.subjects
  }
  submit() {
  }
}
