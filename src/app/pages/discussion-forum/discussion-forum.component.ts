import { Component, OnInit } from '@angular/core';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { isThisHour } from 'date-fns';
import { StudentDetails } from 'src/app/entity/student-details';
import { DiscussionFormResponse } from 'src/app/payload/discussion-form-response';
import { DiscussionFormServiceService } from 'src/app/service/discussion-form-service.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss']
})
export class DiscussionForumComponent implements OnInit {

  discussionFormList: DiscussionFormResponse[] = []
  BASE_URL = this.utilityService.getBaseUrl();
  IMAGE_URL = this.BASE_URL + '/file/getImageApi/images/';
  FILE_URL = this.BASE_URL + '/file/getImageApi/discussionFromFile/'
  student: StudentDetails = new StudentDetails
  constructor(private discussionFormSerice: DiscussionFormServiceService, private loginService: LoginService, private utilityService: UtilityServiceService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.getAllForms()
    this.getStudent();
  }

  public getAllForms() {
    this.discussionFormSerice.getAllDiscussionForm().subscribe(
      {
        next: (data: any) => {
          this.discussionFormList = data
        },
        error: (er) => {
          alert('hi')
        }
      }
    )
  }

  public getFromBYid(id: number) {

  }

  public like(discussionFormId: number) {
    this.discussionFormSerice.addOrRemoveLike(discussionFormId, this.loginService.getStudentId()).subscribe(
      {
        next: (data: any) => {
          this.getAllForms();
        },
        error: (er) => {

        }
      }
    )
  }

  public getStudent() {

    this.studentService.getByStudentById(this.loginService.getStudentId()).subscribe(
      {
        next: (data: any) => {
          this.student = data
        }
      }
    )
  }

}
