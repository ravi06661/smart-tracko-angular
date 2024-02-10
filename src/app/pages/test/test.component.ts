import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { sub } from 'date-fns';
import { SubjectExamResponse } from 'src/app/payload/subject-exam-response';
import { LoginService } from 'src/app/service/login.service';
import { QuestionServiceService } from 'src/app/service/question-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Router } from '@angular/router';
import { ExamServiceService } from 'src/app/service/exam-service.service';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {


  subjectExamResponse: SubjectExamResponse[] = []
  timer: any
  isExamStart: boolean = false
  resultId!: number
  exam: boolean = false
  isCompleted = false;
  constructor(private router: Router,
    private questionService: QuestionServiceService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.getAllExam()
  }

  getAllExam() {
    this.questionService.getAllSubjectExam(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.subjectExamResponse = data.exam
      },
      error: (er: any) => {

      }
    })
  }

  startTest(subjectId: any, examId: any) {
    let params = {
      subjectId: subjectId,
      subjectExamId: examId,
      type: "subjectExam"
    }
    this.router.navigate(['/questions'], {
      queryParams: params
    });
  }

  public isExamStartedOrNot(examId: any): any {

  }


  // public getSubectExamIsCompleteOrNot(subjectId: any) {
  //   this.examService.getSubectExamIsCompleteOrNot(subjectId, this.loginService.getStudentId()).subscribe({
  //     next: (data: any) => {
  //       if (data.status) {
  //         this.resultId = data.resultId;
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err.error.message);

  //     }
  //   })
  // }

}
