import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/entity/student';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
