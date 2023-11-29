import { Component, OnInit } from '@angular/core';
import { Announcement } from 'src/app/entity/announcement';
import { AnnouncementServiceService } from 'src/app/service/announcement-service.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  public announcements: Announcement[] = [];
  constructor(private announcementService: AnnouncementServiceService) { }
  ngOnInit(): void {
    this.getAllPublishedAnnouncement(0, 10);
  }
  public getAllPublishedAnnouncement(page: number, size: number) {
    this.announcementService.getAllPublishedAnnouncement(page, size).subscribe({
      next: (data: any) => {
        this.announcements = data.response;
      },
      error: (err: any) => {
        alert('hello')
      }
    })
  }
}
