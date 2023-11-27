import { Router } from '@angular/router';
import { AnnouncementRequest } from './../../payload/announcement-request';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/entity/course';
import { AnnouncementServiceService } from 'src/app/service/announcement-service.service';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';
import * as SockJS from 'sockjs-client';
import *  as Stomp from "stompjs";
import { id } from 'date-fns/locale';
import { disconnect } from 'process';
@Component({
  selector: 'app-create-announcements',
  templateUrl: './create-announcements.component.html',
  styleUrls: ['./create-announcements.component.scss']
})
export class CreateAnnouncementsComponent implements OnInit {

  imageUrl = this.utilityService.getBaseUrl() + "/file/getImageApi/technologyStackImage/";
  courses: Course[] = [];
  announcementRequest: AnnouncementRequest = new AnnouncementRequest;
  selectedCourseIds: number[] = [];
  selectedCourses: Course[] = [];
  selectAll: boolean = true;
  SOCKET_URL = this.utilityService.getBaseUrl() + '/socket'

  constructor(private courseService: CourseServiceService,
    private utilityService: UtilityServiceService,
    private announcementService: AnnouncementServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.connect()
  }

  public getAllCourses() {
    this.courseService.getAllCourses(-1, 10).subscribe({
      next: (data: any) => {
        this.courses = data;
      }
    })
  }

  public publishAnnouncement() {
    this.announcementService.publishAnnouncement(this.announcementRequest).subscribe({
      next: (data: any) => {
        let courses: number[]=[]
        data.course.forEach((e: any) => {
          courses.push(e.courseId);
        });

        let obj = {
          type: 'announcement',
          date: data.date,
          message: data.message,
          title: data.title,
          allCourse: courses
        }

        Swal.fire('Announcement Published').then(e => {
          this.router.navigate(['/admin/announcements']);
        })
        this.sendMessage(obj);
      },
      error: (err: any) => {
      }
    })
  }

  stompClient: any;
  connection = false
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
        let obj = JSON.parse(message.body)
      });
    });
  }

  // disconnect() {
  //   if (this.connected) {
  //     this.connected = false;
  //     console.log('Disconnected!');
  //     this.wsClient.disconnect();
  //   }
  // }

  public sendMessage(message: any) {
    this.wsClient.send('/api/socket', {}, JSON.stringify(message));
  }

  public clearObj() {
    this.announcementRequest = new AnnouncementRequest;
  }

  public checkboxChanged(courseId: number) {
    const index = this.announcementRequest.courseId.indexOf(courseId);

    if (index === -1) {
      this.announcementRequest.courseId.push(courseId);
    } else {
      this.announcementRequest.courseId.splice(index, 1);
    }
  }

  selectAllChanged() {
    if (!this.selectAll) {
      this.announcementRequest.courseId = [];
    }
    else {
      for (let i = 0; i < this.courses.length; i++) {
        this.announcementRequest.courseId[i] = this.courses[i].courseId;
      }
    }
  }

  public checkCourse(id: number) {
    if (this.announcementRequest.courseId.find(e => e == id))
      return true
    return false;
  }

}
