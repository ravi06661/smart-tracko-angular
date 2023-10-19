import { Component, OnInit } from '@angular/core';
import { CommentResponse } from 'src/app/payload/comment-response';
import { DiscussionFormResponse } from 'src/app/payload/discussion-form-response';
import { DiscussionFormServiceService } from 'src/app/service/discussion-form-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-discussion-forum',
  templateUrl: './admin-discussion-forum.component.html',
  styleUrls: ['./admin-discussion-forum.component.scss']
})
export class AdminDiscussionForumComponent implements OnInit{

  discussionFormResponse:DiscussionFormResponse[]=[];
  commentResonse:CommentResponse[]=[];
  newDiscussion:DiscussionFormResponse=new DiscussionFormResponse
  BASE_URL = this.utilityService.getBaseUrl();
  IMAGE_URL = this.BASE_URL + '/file/getImageApi/images/';
  FILE_URL = this.BASE_URL + '/file/getImageApi/discussionFromFile/'

  ngOnInit(): void {
    this.getAllDiscussion();
  }

  constructor(private discussionService:DiscussionFormServiceService,public utilityService: UtilityServiceService){}

  public getAllDiscussion(){
    this.discussionService.getAllDiscussionForm().subscribe((
    (data:any)=>{
       this.discussionFormResponse=data
      
       
    } 
    ))
  }
  

  public getDaysDifference(createdDate: any): number {
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - new Date(createdDate).getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    return Math.floor(differenceInDays); // Round down to the nearest integer
  }
}
