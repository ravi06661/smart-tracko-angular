import { Component, OnInit } from '@angular/core';
import { StudentDetails } from 'src/app/entity/student-details';
import { CommentResponse } from 'src/app/payload/comment-response';
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
  comment: string = ''
  commentResponse: CommentResponse = new CommentResponse
  discussionFormResponse: DiscussionFormResponse = new DiscussionFormResponse
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
          alert('error')
        }
      }
    )
  }

  public getFromBYid(id: number) {

  }

  public like(discussionFormId: number) {
    this.discussionFormSerice.addOrRemoveLike(this.loginService.getStudentId(), discussionFormId).subscribe(
      {
        next: (data: any) => {
          let form = this.discussionFormList.find(obj => obj.id === discussionFormId) as DiscussionFormResponse
          this.discussionFormResponse = data
          form.likes = this.discussionFormResponse.likes
        },
        error: (er) => {
          alert('hi')
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

  public date(date: any) {
    return this.utilityService.updateTimeline(date)
  }

  public createComment(id: number) {
    console.log(this.comment);

    this.discussionFormSerice.creatCommnet(this.loginService.getStudentId(), id, this.comment).subscribe(
      {
        next: (data: any) => {
          let form = this.discussionFormList.find(obj => obj.id === id) as DiscussionFormResponse
          this.commentResponse = data
          form.comments.push(this.commentResponse)
          this.comment = ''
        },
        error: (er) => {
          alert('error')
        }
      }
    )
  }
 
  public createDiscussionForm(){
     
  }

}
