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

  constructor(private discussionFormSerice: DiscussionFormServiceService,
    private loginService: LoginService,
    private utilityService: UtilityServiceService,
    private studentService: StudentService,
    private chatService: ChatServiceService, private webSocketService: WebsocketServiceDiscussionFormService
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
          this.sendMessage(new LikeResponseForm(discussionFormId, 'likeResponse', data.likes, data.isLike, this.loginService.getStudentId()))
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
          //  let form = this.discussionFormList.find(obj => obj.id === id) as DiscussionFormResponse
          // this.commentResponse = data
          //  form.comments.push(this.commentResponse)
          this.comment = ''
          this.sendMessage(new CommentResponseForm(id, data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'commentResponse'))
        },
        error: (er) => {
          alert('error')
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
            this.discussionFormList.push(data);
            let obj = new DiscussionResponseForm(data.studentProfilePic, data.studentName, data.content, (data.createdDate).toString(), data.id, 'createDiscussionForm', data.file, this.student.studentId);
            this.discussionForm = new DiscussionFormResponse()
            this.sendMessage(obj);
          },
          error: (er) => {
            alert('error')
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


  stompClient: any;
  connection = false
  SOCKET_URL = this.BASE_URL + '/socket';
  wsClient: any;
  connected!: boolean;

  connect() {
    const socket = new SockJS(this.SOCKET_URL);
    this.wsClient = Stomp.over(socket);

    const that = this;
    this.wsClient.connect({}, () => {
      console.log('Connected!');
      that.connected = true;
      that.wsClient.subscribe('/queue/messages', (message: { body: any }) => {

        let obj = JSON.parse(message.body);
        switch (obj.type) {
          case 'commentResponse':
            let comres = JSON.parse(message.body);
            let form = this.discussionFormList.find(obj => obj.id === comres.discussionFormId) as DiscussionFormResponse
            form.comments.unshift(comres)
            break;
          case 'likeResponse':
            let likeres = JSON.parse(message.body);
            let form1 = this.discussionFormList.find(obj => obj.id === likeres.discussionFormId) as DiscussionFormResponse
            form1.likes = likeres.likes

            if (this.loginService.getStudentId() == likeres.studentId) {
              form1.isLike = likeres.isLike
            }
            break;
          case 'createDiscussionForm':
            let res = JSON.parse(message.body);
            let obj = new DiscussionFormResponse
            obj = res;
            obj.likes = []
            this.discussionFormList.unshift(obj)
            break;
          default:
            break;
        }
      });
    });
  }

  disconnect() {
    if (this.connected) {
      this.connected = false;
      console.log('Disconnected!');
      this.wsClient.disconnect();
    }
  }

  sendMessage(message: any) {
    this.wsClient.send('/api/socket', {}, JSON.stringify(message));
  }

}