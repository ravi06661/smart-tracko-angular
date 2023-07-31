import { Component, OnInit } from '@angular/core';
import { NewsAndEvent } from 'src/app/entity/news-and-event';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-newsandevents',
  templateUrl: './newsandevents.component.html',
  styleUrls: ['./newsandevents.component.scss']
})
export class NewsandeventsComponent implements OnInit {

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/newsEventImage/';

  newsAndEvents:NewsAndEvent[]=[];
  totalNewsAndEvent:number=0;
  constructor (private newsAndEventService:NewsEventServiceService,private utilityService:UtilityServiceService) {}

  ngOnInit(): void {
    this.getAllNewsAndEvents(0,8);
  }

  public getAllNewsAndEvents(page:number,size:number){
    this.newsAndEventService.getAllNewsAndEventsIsActive(page,size).subscribe({
      next:(data:any)=>{
        this.newsAndEvents = data.response;
        this.totalNewsAndEvent = data.totalElements;
      }
    })
  }

  public onChangePage(event: any) {
    this.getAllNewsAndEvents(event.pageIndex, event.pageSize);
  }
}
