import { Component, OnInit } from '@angular/core';
import { StudentDetails } from 'src/app/entity/student-details';
import { CommentResponse } from 'src/app/payload/comment-response';
import { DiscussionFormResponse } from 'src/app/payload/discussion-form-response';
import { DiscussionFormServiceService } from 'src/app/service/discussion-form-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-discussion-forum',
  templateUrl: './admin-discussion-forum.component.html',
  styleUrls: ['./admin-discussion-forum.component.scss']
})
export class AdminDiscussionForumComponent implements OnInit {

  discussionFormResponse: DiscussionFormResponse[] = [];
  commentResonse: CommentResponse[] = [];
  newDiscussion: DiscussionFormResponse = new DiscussionFormResponse
  student: StudentDetails = new StudentDetails
  BASE_URL = this.utilityService.getBaseUrl();
  IMAGE_URL = this.BASE_URL + '/file/getImageApi/images/';
  FILE_URL = this.BASE_URL + '/file/getImageApi/discussionFromFile/'

  ngOnInit(): void {
    this.getAllDiscussion();
  }

  constructor(private discussionFormSerice: DiscussionFormServiceService, public utilityService: UtilityServiceService) { }

  public getAllDiscussion() {
    this.discussionFormSerice.getAllDiscussionForm(0).subscribe((
      (data: any) => {
        this.discussionFormResponse = data
      }
    ))
  }


  public getDaysDifference(createdDate: any): number {
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - new Date(createdDate).getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    return Math.floor(differenceInDays); // Round down to the nearest integer
  }

  public removeComments(discussionFormId: number, commentsId: number) {

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.discussionFormSerice.removeComment(discussionFormId,commentsId).subscribe({
    //      next:(data:any)=>{
    //       this.newDiscussion.comments=data.comments
    //      }
    //     })
    //     Swal.fire(
    //       'Deleted!',
    //       'Comment has been deleted.',
    //       'success'
    //     )
    //   }
    // })

    Swal.fire('Comment Is Deleted Successfully!')
    this.discussionFormSerice.removeComment(discussionFormId, commentsId).subscribe({
      next: (data: any) => {
        this.newDiscussion.comments = data.comments
      }
    })

  }


}
