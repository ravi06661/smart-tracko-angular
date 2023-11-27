import { Announcement } from './../../entity/announcement';
import { DatePipe, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { parseDate } from 'igniteui-angular/lib/core/utils';
import * as moment from 'moment';
import { Observable, interval, map, min, switchMap } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Attendance } from 'src/app/entity/attendance';
import { Profile } from 'src/app/entity/profile';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { AnnouncementServiceService } from 'src/app/service/announcement-service.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import *  as Stomp from "stompjs"
@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss'],
})
export class RightSideBarComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  profileData: Profile = new Profile();
  readMessage = false;
  messageNo = 0;
  timeline: string = '';
  Coursestatus: Boolean = false
  announcements: Announcement[] = [];
  unseenNotification = 0;

  constructor(private studentService: StudentService,
    public utilityService: UtilityServiceService,
    private loginService: LoginService,
    private adminService: AdminServiceService,
    private annoucementService: AnnouncementServiceService) { }

  ngOnInit(): void {
    if (this.loginService.getRole() == 'STUDENT') {
      this.profileData = this.studentService.getStudentHeaderProfileData();
      this.getAnnouncementsForStudents();
    } else if (this.loginService.getRole() == 'ADMIN') {
      this.profileData = this.adminService.getAdminProfileData()
    }
    this.connect()
  }

  public getAnnouncementsForStudents() {
    this.annoucementService.getAnnouncementForStudent(this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
        this.announcements = data;
        this.unseenNotification = this.announcements.length
      },
      error: (err: any) => {

      }
    })
  }

  public seenMessage(msgNo: number, announcementId: number) {
    this.messageNo = msgNo;
    this.readMessage = !this.readMessage;
    this.annoucementService.seenMassageByStudent(announcementId, this.loginService.getStudentId()).subscribe({
      next: (data: any) => {
      },
      error: (err: any) => {

      }
    })
  }

  stompClient: any;
  connection = false
  wsClient: any;
  connected!: boolean;
  SOCKET_URL = this.utilityService.getBaseUrl() + '/socket'

  connect() {
    const socket = new SockJS(this.SOCKET_URL);
    this.wsClient = Stomp.over(socket);
    const that = this;
    this.wsClient.connect({}, () => {
      console.log('Connected!');
      that.connected = true;
      that.wsClient.subscribe('/queue/messages', (message: { body: any }) => {
        let obj = JSON.parse(message.body)
        if (obj.type == 'announcement') {
          let newObject = new Announcement(obj.title, obj.message, obj.date);
          this.getStudentCouse(obj.allCourse)
          if (this.Coursestatus) {
            this.announcements.unshift(newObject);
          }
        }
      });
    });
  }
  public getStudentCouse(course: number[]) {
    let courseId!: number
    this.studentService.getByStudentById(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        courseId = data.course.courseId;
        course.forEach((e: any) => {
          if (e == courseId) {
            alert('set true')
            this.Coursestatus = true;
          }
        });
      }
    )
  }
}
