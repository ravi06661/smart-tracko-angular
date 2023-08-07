import { Component, OnInit } from '@angular/core';
import { dt } from '@fullcalendar/core/internal-common';
import { error, log } from 'console';
import { Course } from 'src/app/entity/course';
import { Profile } from 'src/app/entity/profile';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-profile-bar',
  templateUrl: './profile-bar.component.html',
  styleUrls: ['./profile-bar.component.scss']
})

export class ProfileBarComponent implements OnInit {
  profileData: Profile = new Profile();
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  constructor(private studentService: StudentService, private utilityService: UtilityServiceService,private loginService:LoginService,private adminService:AdminServiceService) {
  }
  
  ngOnInit(): void {
  
    if( this.loginService.getRole()=='STUDENT'){
      this.profileData = this.studentService.getStudentHeaderProfileData();
    }else  if( this.loginService.getRole()=='ADMIN'){
      this.profileData = this.adminService.getAdminProfileData()
    } 
  }
}


