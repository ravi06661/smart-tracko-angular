import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsAndEventRequest } from 'src/app/payload/news-and-event-request';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';

@Component({
  selector: 'app-admin-edit-news-and-events',
  templateUrl: './admin-edit-news-and-events.component.html',
  styleUrls: ['./admin-edit-news-and-events.component.scss']
})
export class AdminEditNewsAndEventsComponent implements OnInit{
  

  id:number=0;
  newsAndEventRequest:NewsAndEventRequest=new NewsAndEventRequest();
constructor(private newsAndEventService:NewsEventServiceService,private activateRoute:ActivatedRoute,private router:Router){}
ngOnInit(): void {
 this.id=this.activateRoute.snapshot.params[('id')];
 this.getNewsAndEventById();
}

updateNewsAndEvent(){
  this.newsAndEventService.updateNewsAndEvent(this.newsAndEventRequest).subscribe(
    (data:any)=>{
      this.newsAndEventRequest=data
    }
  )
}

getNewsAndEventById(){
  this.newsAndEventService.getByNewsById(this.id).subscribe(
    (data:any)=>{
      this.newsAndEventRequest=data;
    }
  )
}

addMedia(event: any) {
  this.newsAndEventRequest.file = event.target.files[0];
 
}

imageSrc: any = null;  // Initialize with null

loadFile(event: any) {
 const file = event.target.files[0];
 if (file) {
   const reader = new FileReader();
   reader.onload = (e: any) => {
     this.newsAndEventRequest.fileName=e.target.result;
     this.imageSrc = this.newsAndEventRequest.file;
   };
   reader.readAsDataURL(file);
 }
}

addImage(event: any) {
 const file = event.target.files[0];
 if (file) {
   const reader = new FileReader();
   reader.onload = (e: any) => {
     this.newsAndEventRequest.file=event.target.files[0];
     this.imageSrc=this.newsAndEventRequest.file
   };
   reader.readAsDataURL(file);
 }
}
}