import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { Course } from 'src/app/entity/course';
import { Profile } from 'src/app/entity/profile';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-profile-bar',
  templateUrl: './profile-bar.component.html',
  styleUrls: ['./profile-bar.component.scss']
})
export class ProfileBarComponent implements OnInit {
  profileData: Profile = new Profile();
  constructor(private qrLogin: QRServiceService) {
    this.profileData.name = ''
    this.profileData.course = ''
  }

  ngOnInit(): void {
    if (this.profileData != null) {
      this.profileData = this.qrLogin.getProfileData();
    }

  }
}


