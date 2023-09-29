import { Router } from '@angular/router';
import { AnnouncementRequest } from './../../payload/announcement-request';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/entity/course';
import { AnnouncementServiceService } from 'src/app/service/announcement-service.service';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-announcements',
  templateUrl: './create-announcements.component.html',
  styleUrls: ['./create-announcements.component.scss']
})
export class CreateAnnouncementsComponent implements OnInit{

  imageUrl = this.utilityService.getBaseUrl()+"/file/getImageApi/technologyStackImage/";
  courses:Course[] = [];
  announcementRequest:AnnouncementRequest = new AnnouncementRequest;
  selectedCourseIds:number[] = [];
  selectedCourses:Course[] = [];
  selectAll: boolean = true;

  constructor(private courseService:CourseServiceService,
    private utilityService:UtilityServiceService,
    private announcementService:AnnouncementServiceService,
    private router:Router){}

  ngOnInit(): void {
    this.getAllCourses();
  }

  public getAllCourses(){
    this.courseService.getAllCourses(-1,10).subscribe({
      next:(data:any)=>{
       this.courses = data;
      }
    })
  }

  public publishAnnouncement(){
    this.announcementService.publishAnnouncement(this.announcementRequest).subscribe({
      next:(data:any)=>{
        Swal.fire('Announcement Published').then(e=>{
          this.router.navigate(['/admin/announcements']);
        })
      },
      error:(err:any)=>{

      }
    })
  }

  public clearObj(){
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
    console.log(this.selectAll);
    
    if(!this.selectAll){
      this.announcementRequest.courseId = [];
    }
    else{
      for (let i=0 ;i<this.courses.length;i++) {
        this.announcementRequest.courseId[i] = this.courses[i].courseId;
      }
    }     
  }

  public checkCourse(id:number){
    if(this.announcementRequest.courseId.find(e=>e == id))
      return true
    return false;
  }

}
