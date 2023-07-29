import { DatePipe, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { parseDate } from 'igniteui-angular/lib/core/utils';
import * as moment from 'moment';
import { Observable, interval, map, min, switchMap } from 'rxjs';
import { Attendance } from 'src/app/entity/attendance';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss'],
})
export class RightSideBarComponent implements OnInit {


  ngOnInit(): void {
   
  }

  
}
