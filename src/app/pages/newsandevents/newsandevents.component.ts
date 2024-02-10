import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { log } from 'console';
import { NewsAndEvent } from 'src/app/entity/news-and-event';
import { NewsEventServiceService } from 'src/app/service/news-event-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-newsandevents',
  templateUrl: './newsandevents.component.html',
  styleUrls: ['./newsandevents.component.scss']
})
export class NewsandeventsComponent implements OnInit {

  newsAndEvents: NewsAndEvent[] = [];
  news: NewsAndEvent[] = []
  totalNewsAndEvent: number = 0;
  currentDate: string | null | undefined;
  createdDate: any;
  dayAgoForChild: number = 0;
  constructor(private newsAndEventService: NewsEventServiceService, public utilityService: UtilityServiceService) { }


  ngOnInit(): void {
    this.getAllNewsAndEvents(0, 8);
  }

  public getAllNewsAndEvents(page: number, size: number) {
    this.newsAndEventService.getAllNewsAndEventsIsActive(page, size).subscribe({
      next: (data: any) => {
        this.totalNewsAndEvent = data.totalElements;
        this.newsAndEvents = this.getNewsAndEvent(data);
      }
    })
  }

  public onChangePage(event: any) {
    this.getAllNewsAndEvents(event.pageIndex, event.pageSize);
  }

  public getNewsAndEvent(data: any): NewsAndEvent[] {
    const news: NewsAndEvent[] = [];

    for (const element of data.response) {
      const count = this.getDaysDifference(element.createdDate);
      element.dayAgo = count; // Assuming the NewsAndEvent interface has a property called 'daysDifference'
      news.push(element);
    }

    return news;
  }

  public getDaysDifference(createdDate: any): number {
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - new Date(createdDate).getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    return Math.floor(differenceInDays); // Round down to the nearest integer
  }
  public parentTochild(dayAgo: number) {

  }
}

