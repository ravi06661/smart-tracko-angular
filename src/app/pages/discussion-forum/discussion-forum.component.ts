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
import { DiscussionResponseForm } from 'src/app/payload/discussion-response-form';
import * as Stomp from "stompjs";
import * as SockJS from 'sockjs-client';
import { WebsocketServiceDiscussionFormService } from 'src/app/service/websocket-service-discussion-form-service.service';
import { CommentResponseForm } from 'src/app/payload/comment-response-form';
import { LikeResponseForm } from 'src/app/payload/like-response-form';
import { Typing } from 'src/app/entity/typing';
import { C } from '@fullcalendar/core/internal-common';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { MessageSeenBy } from 'src/app/entity/message-seen-by';
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
  message!: string;
  typing: Typing[] = []

  constructor(private discussionFormSerice: DiscussionFormServiceService,
    private loginService: LoginService,
    private utilityService: UtilityServiceService,
    private studentService: StudentService,
    private webSocketService: WebsocketServiceDiscussionFormService
  ) { }

  ngOnInit(): void {
    this.getAllForms()
    this.getStudent();
    this.connect();
  }

  public getAllForms() {
    this.discussionFormSerice.getAllDiscussionForm(this.loginService.getStudentId()).subscribe(
      {
        next: (data: any) => {
          this.discussionFormList = data
        },
        error: (er) => {
          alert('something went wrong...')
        }
      }
    )
  }

  public like(discussionFormId: number) {
    this.discussionFormSerice.addOrRemoveLike(this.loginService.getStudentId(), discussionFormId).subscribe(
      {
        next: (data: any) => {
          let form = this.discussionFormList.find(obj => obj.id === discussionFormId) as DiscussionFormResponse
          form.likes = data.likes
          this.sendMessage(new LikeResponseForm(discussionFormId, 'likeResponse', data.likes, data.isLike, this.loginService.getStudentId()))
        },
        error: (er) => {
          alert('something went wrong...')
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
          //  let form = this.discussionFormList.find(obj => obj.id === id) as DiscussionFormResponse
          // this.commentResponse = data
          //  form.comments.push(this.commentResponse)
          this.comment = ''
          this.sendTypingUser('typed')
          this.sendMessage(new CommentResponseForm(id, data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'commentResponse'))

        },
        error: (er) => {
          alert('something went wrong...')
        }
      }
    )

  }
  isTrue: boolean = false
  public createDiscussionForm() {
    if (this.isTrue) {
      this.message = ''
      this.isTrue = false
      this.discussionFormSerice.createDiscussionForm(this.student.studentId, this.discussionForm.content, this.discussionForm.file).subscribe(
        {
          next: (data: any) => {
            //  this.discussionFormList.push(data);
            let obj = new DiscussionResponseForm(data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'createDiscussionForm', data.file, this.student.studentId);
            this.discussionForm = new DiscussionFormResponse()
            this.sendMessage(obj);
          },
          error: (er) => {
            alert('something went wrong...')
          }
        }
      )
    } else {
      this.message = 'message can not be empty'
      this.isTrue = false
    }
  }

  public clearMessage() {
    if (this.discussionForm.content !== null && this.discussionForm.content !== '' && this.message !== undefined) {
      this.message = ''
      this.isTrue = true
    } else {
      this.message = 'message can not be empty'
      this.isTrue = false
    }
  }

  public fileEvent(event: any) {
    this.discussionForm.file = event.target.files[0];
  }

  toggleComment(index: number): void {
    this.commnetVisibility = [false]
    this.commnetVisibility[index] = !this.commnetVisibility[index];
  }

  connect() {
    this.webSocketService.getMessages().subscribe((message) => {
      
      switch (message.type) {
        case 'commentResponse':
          let form = this.discussionFormList.find(obj => obj.id === message.discussionFormId) as DiscussionFormResponse
          if (form && !form.comments.find(c => c.id === message.id)) {
            form.comments.unshift(message);
          }
          break;
        case 'likeResponse':
          let form1 = this.discussionFormList.find(obj => obj.id === message.discussionFormId) as DiscussionFormResponse
          form1.likes = message.likes
          if (this.loginService.getStudentId() == message.studentId) {
            form1.isLike = message.isLike
          }
          break;
        case 'createDiscussionForm':
          if (!this.discussionFormList.find(e => e.id === message.id)) {
            this.discussionFormList.unshift(message);
          }
          break;
        case 'typing':
          this.pushTypingMessage(message);
          break;
        default:
          break;
      }
    });
  }

  public sendMessage(data: any) {
    this.webSocketService.sendMessage(data);
  }

  public sendTypingUser(status: any) {
    let obj = {
      type: 'typing',
      status: status,
      name: this.student.fullName,
      id: this.student.studentId
    }
    this.sendMessage(obj);
  }

  private timeOut: number = 10000; // 10 seconds

  public pushTypingMessage(
    message: any): void {
    if (message.status === 'typed') {
      let obj = this.typing.find(e => e.id == message.id)
      if (obj) {
        this.removeTypingUser(message);
        return;
      }
    } else {
      let obj = this.typing.find(e => e.id === message.id) as Typing
      if (!obj) {
        if (this.student.studentId !== message.id)
          this.typing.push(message);
        setTimeout(() => {
          this.remove(message);
        }, this.timeOut);
      }
    }
  }

  public remove(message: any): void {
    const index: number = this.typing.indexOf(message);
    if (index !== -1) {
      this.typing.splice(index, 1);
    }
  }

  public removeTypingUser(message: any) {
    this.typing = this.typing.filter(obj => obj.id !== message.id) as Typing[]
  }
}

