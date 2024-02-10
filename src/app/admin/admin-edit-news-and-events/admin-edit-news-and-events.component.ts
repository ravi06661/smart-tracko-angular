import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsAndEventRequest } from 'src/app/payload/news-and-event-request';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-edit-news-and-events',
  templateUrl: './admin-edit-news-and-events.component.html',
  styleUrls: ['./admin-edit-news-and-events.component.scss']
})
export class AdminEditNewsAndEventsComponent implements OnInit{
  
  id:number=0;
  newsAndEventRequest:NewsAndEventRequest=new NewsAndEventRequest();
  imageName:string = '';
  imagePreview:string = '';

constructor(private newsAndEventService:NewsEventServiceService,
  private activateRoute:ActivatedRoute,){}

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
      this.newsAndEventRequest.fileName = data.image
      this.imagePreview =this.newsAndEventRequest.fileName
    }
  )
}

addMedia(event: any) {
  this.newsAndEventRequest.file = event.target.files[0];
 
}

public addImage(event: any) {
  this.newsAndEventRequest.fileName=event.target.files[0];

  const selectedFile = event.target.files[0];
  
  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.imageName = selectedFile.name;
    };

    reader.readAsDataURL(selectedFile);
  } else {
    this.imagePreview = '';
    this.imageName = '';
  }
}

public removeImage(){
  this.imagePreview = '';
  this.imageName = '';
  this.newsAndEventRequest.fileName = '';
}


// loadFile(event: any) {
//  const file = event.target.files[0];
//  if (file) {
//    const reader = new FileReader();
//    reader.onload = (e: any) => {
//      this.newsAndEventRequest.fileName=e.target.result;
//      this.imageSrc = this.newsAndEventRequest.file;
//    };
//    reader.readAsDataURL(file);
//  }
// }

// addImage(event: any) {
//  const file = event.target.files[0];
//  if (file) {
//    const reader = new FileReader();
//    reader.onload = (e: any) => {
//      this.newsAndEventRequest.file=event.target.files[0];
//      this.imageSrc=this.newsAndEventRequest.file
//    };
//    reader.readAsDataURL(file);
//  }
// }
}