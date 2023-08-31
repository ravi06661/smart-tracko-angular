import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsAndEventRequest } from 'src/app/payload/news-and-event-request';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-create-news-and-events',
  templateUrl: './admin-create-news-and-events.component.html',
  styleUrls: ['./admin-create-news-and-events.component.scss']
})
export class AdminCreateNewsAndEventsComponent implements OnInit{

   newRequest:NewsAndEventRequest=new NewsAndEventRequest();
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  constructor (private newsEventService:NewsEventServiceService,private utilityService:UtilityServiceService,private router:Router)  {}


  createNewsAndEvent(){
    this.newsEventService.createNewsAndEvent(this.newRequest).subscribe(
      (data:any)=>{

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'success',
          title: 'Fees Add success !!'
        }).then(e => {
          this.newRequest = new NewsAndEventRequest
          this.router.navigate(['/admin/newsAndEvent']);
        })
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'error',
          title: 'Registration failed !!'
        })
      }
    )
  }
  addImage(event:any){
    this.newRequest.file=event.target.files[0];
     console.log(this.newRequest.file);
     console.log('hii');
     

  }

  
  addMedia(event: any) {
     this.newRequest.file = event.target.files[0];
    
  }
}
