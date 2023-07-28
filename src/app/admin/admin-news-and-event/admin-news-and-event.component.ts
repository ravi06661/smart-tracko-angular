import { UtilityServiceService } from './../../service/utility-service.service';
import { Component, OnInit } from '@angular/core';
import { NewsAndEvent } from 'src/app/entity/news-and-event';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';

@Component({
  selector: 'app-admin-news-and-event',
  templateUrl: './admin-news-and-event.component.html',
  styleUrls: ['./admin-news-and-event.component.scss']
})
export class AdminNewsAndEventComponent implements OnInit {

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/File/getImageApi/newsEventImage/'
  newsAndEvents:NewsAndEvent[]=[];
  page=0;
  size=10;
  totalNewsAndEvents=0;
  constructor (private newsEventService:NewsEventServiceService,private utilityService:UtilityServiceService)  {}

  ngOnInit(): void {
    this.getAllNewsAndEvents(this.page,this.size);
  }

  public getAllNewsAndEvents(page:number,size:number){
    this.newsEventService.getAllNewsAndEvents(page,size).subscribe({
      next:(data:any)=>{
        this.newsAndEvents = data.content;
        this.totalNewsAndEvents = data.totalElements;
      }
    })
  }

  public activeAndInActive(id:number){
    this.newsEventService.updateActiveAndInActive(id).subscribe({
      next:(data:any)=>{

      }
    })
  }

  public deleteNewsAndEvents(id:number){
    this.newsEventService.deleteNewsAndEvents(id).subscribe({
      next:(data)=>{
        this.getAllNewsAndEvents(this.page,this.size);

      }
    })
  }

  public searchNewsAndEvents(search:any){
    if(search==''){
      this.getAllNewsAndEvents(this.page,this.size);
    }else{
      this.newsEventService.searchNewsAndEvents(search,'admin',0,10).subscribe({
        next:(data:any)=>{
          this.newsAndEvents = data.content;
          this.totalNewsAndEvents = 0;
        }
      })
    }
  }

  public pageChange(event:any){
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.getAllNewsAndEvents(this.page,this.size);
  }
}
