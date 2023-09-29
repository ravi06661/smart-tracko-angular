import { Announcement } from './../../entity/announcement';
import { DatePipe, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { parseDate } from 'igniteui-angular/lib/core/utils';
import * as moment from 'moment';
import { Observable, interval, map, min, switchMap } from 'rxjs';
import { Attendance } from 'src/app/entity/attendance';
import { Profile } from 'src/app/entity/profile';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { AnnouncementServiceService } from 'src/app/service/announcement-service.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss'],
})
export class RightSideBarComponent implements OnInit {
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  profileData: Profile = new Profile();

  announcements:Announcement [] = [];
  unseenNotification = 0;

  constructor(private studentService: StudentService, 
    private utilityService: UtilityServiceService,
    private loginService:LoginService,
    private adminService:AdminServiceService,
    private annoucementService:AnnouncementServiceService) { }

  ngOnInit(): void {
    if( this.loginService.getRole()=='STUDENT'){
      this.profileData = this.studentService.getStudentHeaderProfileData();
    }else  if( this.loginService.getRole()=='ADMIN'){
      this.profileData = this.adminService.getAdminProfileData()
    } 

    this.getAnnouncementsForStudents();
  }

  public getAnnouncementsForStudents(){
    this.annoucementService.getAnnouncementForStudent(this.loginService.getStudentId()).subscribe({
      next:(data:any)=>{
        this.announcements = data;
        this.unseenNotification = this.announcements.length
      },
      error:(err:any)=>{

      }
    })
  }
}
