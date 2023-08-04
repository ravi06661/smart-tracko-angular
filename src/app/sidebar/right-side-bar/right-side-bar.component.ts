import { DatePipe, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { parseDate } from 'igniteui-angular/lib/core/utils';
import * as moment from 'moment';
import { Observable, interval, map, min, switchMap } from 'rxjs';
import { Attendance } from 'src/app/entity/attendance';
import { Profile } from 'src/app/entity/profile';
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

  constructor(private studentService: StudentService, private utilityService: UtilityServiceService) { }

  ngOnInit(): void {
    this.profileData = this.studentService.getStudentProfileData();
  }
}
