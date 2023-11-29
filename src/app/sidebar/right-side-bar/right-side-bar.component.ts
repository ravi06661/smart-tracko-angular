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
import { WebsocketServiceDiscussionFormService } from 'src/app/service/websocket-service-discussion-form-service.service';
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
    private annoucementService: AnnouncementServiceService, private websocketService: WebsocketServiceDiscussionFormService) { }

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
  public connect() {
    this.websocketService.getMessages().subscribe((message) => {
      if (message.type == 'announcement') {
        let newObject = new Announcement(message.title, message.message, message.date);
        this.getStudentCourse(message.allCourse).then(() => {
          if (this.Coursestatus) {
            this.Coursestatus = false;
            this.announcements.unshift(newObject);
          }
        });
      }
    });
  }

  public async getStudentCourse(course: number[]): Promise<void> {
    let courseId = 0;
    const data: any = await this.studentService.getByStudentById(this.loginService.getStudentId()).toPromise();
    courseId = data.course.courseId;
    this.Coursestatus = course.includes(courseId);
  }


}
