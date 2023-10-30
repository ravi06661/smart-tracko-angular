import { Component, OnInit } from '@angular/core';
import { StudentDetails } from 'src/app/entity/student-details';
import { CommentResponse } from 'src/app/payload/comment-response';
import { DiscussionFormResponse } from 'src/app/payload/discussion-form-response';
import { DiscussionFormServiceService } from 'src/app/service/discussion-form-service.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Subscription } from "rxjs";
import { ChatServiceService } from 'src/app/service/chat-service-service.service';
import { LikeResponse } from 'src/app/payload/like-response';
import { CommentResponseForm } from 'src/app/payload/comment-response-form';
import { LikeResponseForm } from 'src/app/payload/like-response-form';
import { DiscussionResponseForm } from 'src/app/payload/discussion-response-form';

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
  likeResponse = new LikeResponse
  discussionFormResponse: DiscussionFormResponse = new DiscussionFormResponse
  discussionForm = new DiscussionFormResponse
  commnetVisibility: boolean[] = []

  constructor(private discussionFormSerice: DiscussionFormServiceService,
    private loginService: LoginService,
    private utilityService: UtilityServiceService,
    private studentService: StudentService,
    private chatService: ChatServiceService
  ) { }

  ngOnInit(): void {
    this.getAllForms()
    this.getStudent();
    this.connect();
  }

  public getAllForms() {
    this.discussionFormSerice.getAllDiscussionForm().subscribe(
      {
        next: (data: any) => {
          if (data !== null) {
            this.discussionFormList = data.filter((obj: any) => {
              if (obj.likes.length == 0) {
                obj.likes = []
                return obj;
              } else
                return obj;
            }) as DiscussionFormResponse[]
          }
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
          form.likes = data.likes
          this.sendMessage(new LikeResponseForm(discussionFormId, 'likeResponse', data.likes))
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
    this.discussionFormSerice.creatCommnet(this.loginService.getStudentId(), id, this.comment).subscribe(
      {
        next: (data: any) => {
          let form = this.discussionFormList.find(obj => obj.id === id) as DiscussionFormResponse
          this.commentResponse = data
          form.comments.push(this.commentResponse)
          this.comment = ''
          this.sendMessage(new CommentResponseForm(id, data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'commentResponse'))
        },
        error: (er) => {
          alert('error')
        }
      }
    )

  }

  public createDiscussionForm() {
    this.discussionFormSerice.createDiscussionForm(this.student.studentId, this.discussionForm.content, this.discussionForm.file).subscribe(
      {
        next: (data: any) => {
          this.discussionFormList.push(data);
          let obj = new DiscussionResponseForm(data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'createDiscussionForm', data.file, this.student.studentId);
          this.discussionForm = new DiscussionFormResponse
          this.sendMessage(obj);
        },
        error: (er) => {
          alert('error')
        }
      }
    )
  }

  subscription!: Subscription;

  connect() {
    this.chatService.connectForDiscussionForm();
    this.subscription = this.chatService.messages.subscribe((msg) => {

      switch (msg.type) {
        case 'commentResponse':
          let form = this.discussionFormList.find(obj => obj.id === msg.discussionFormId) as DiscussionFormResponse
          this.commentResponse = msg
          form.comments.push(this.commentResponse)
          break;

        case 'likeResponse':
          let form1 = this.discussionFormList.find(obj => obj.id === msg.discussionFormId) as DiscussionFormResponse
          form1.likes = msg.likes
          break;

        case 'createDiscussionForm':
          let obj = new DiscussionFormResponse
          obj = msg;
          obj.likes = []
          this.discussionFormList.push(obj)
          break;
          
        default:
          break;
      }
    });
  }

  disconnect() {
    this.chatService.disconnect();
    this.subscription.unsubscribe();
  }

  sendMessage(res: any) {
    this.chatService.messages.next(res);
  }

  public fileEvent(event: any) {
    this.discussionForm.file = event.target.files[0];
  }

  toggleComment(index: number): void {
    this.commnetVisibility[index] = !this.commnetVisibility[index];
  }

  public chekLike(obj: any) {
    if (obj !== null) {
      let result = obj.likes.find((object: any) => object.studentName == this.student.fullName)
      if (result) {
        return "assets/images/temp_img/like_filled.png"
      } else {
        return "assets/images/temp_img/like_blank.png"
      }
    } else {
      return ""
    }
  }
}