import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsAndEvent } from 'src/app/entity/news-and-event';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-newsand-events-description',
  templateUrl: './newsand-events-description.component.html',
  styleUrls: ['./newsand-events-description.component.scss']
})
export class NewsandEventsDescriptionComponent implements OnInit {

  BASE_URL=this.utilityService.getBaseUrl();
  imageUrl=this.BASE_URL+'/file/getImageApi/newsEventImage/';

 // newsAndEvents:NewsAndEvent[]=[];
 newsAndEvents:NewsAndEvent=new NewsAndEvent
  totalNewsAndEvent:number=0;
  id:number=0
  constructor (private activatedRoute: ActivatedRoute,private newsAndEventService:NewsEventServiceService,private utilityService:UtilityServiceService) {}

  ngOnInit(): void {
    this.id=this.activatedRoute.snapshot.params[('id')]

    this.newsAndEventService.getByNewsById(this.id).subscribe({
      next:(data:any)=>{
        this.newsAndEvents=data
      }
    })
  }
}
