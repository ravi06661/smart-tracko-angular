import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentQuestionRequest } from 'src/app/payload/assignment-question-request';
import { TaskQuestionRequest } from 'src/app/payload/task-question-request';
import { AssignmentServiceService } from 'src/app/service/assignment.service';

@Component({
  selector: 'app-admin-create-assignments',
  templateUrl: './admin-create-assignments.component.html',
  styleUrls: ['./admin-create-assignments.component.scss'],
})
export class AdminCreateAssignmentsComponent implements OnInit {
  assignmentId = 0;
  public Editor = ClassicEditor;
  assignment: Assignment = new Assignment();
  assignmentQuestionsData: AssignmentQuestionRequest =
    new AssignmentQuestionRequest();
  taskQuestion: TaskQuestionRequest = new TaskQuestionRequest();
  imagePreview: string[] = [];
  imageName: string[] = [];
  newImg = '';
  attachmentInfo = {
    name : '',
    size : 0
  } ;


  constructor(
    private activateRoute: ActivatedRoute,
    private assignmentService: AssignmentServiceService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.assignmentId = this.activateRoute.snapshot.params['id'];
    this.assignmentQuestionsData.assignmentId = this.assignmentId;
    this.getAssignmentById();
  }

  public getAssignmentById() {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (data: any) => {
        this.assignment = data;
      },
    });
  }

  public addImageFile(event: any) {
    console.log(event);
    this.taskQuestion.questionImages.push(event.target.files[0]);
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreview.push(e.target.result);
        this.imageName.push(selectedFile.name);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      this.imagePreview.push('');
      this.imageName.push('');
    }
  }

  public addTaskQuestion() {
    this.assignmentQuestionsData.assignmentQuestion.push(this.taskQuestion);
    this.taskQuestion = new TaskQuestionRequest();
    this.imagePreview = [];
    this.imageName = [];
    console.log(this.assignmentQuestionsData);
  }


  public addAttachmentFile(event:any){
    const data =  event.target.files[0];
    this.attachmentInfo.name = event.target.files[0].name
    this.attachmentInfo.size = Math.floor(((event.target.files[0].size)/1024)/1024)
    this.assignmentQuestionsData.taskAttachment = event.target.files[0];
  }

  public submitAssignmentQuestions(){
    this.assignmentService.addAssignmentQuestions(this.assignmentQuestionsData).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.router.navigate(['/admin/task']);
      }
    })
  }







  imageUrll:any
  public showImage(file: any) {
    return  'assets/images/temp_img/modal.png';
  }
  public imageUrl(file: any): void {
   // const selectedFile = file;
    console.log('calling');
    
    // if (selectedFile) {
    //     const reader = new FileReader();

    //     reader.onload = (e: any) => {
    //         this.imageUrll = e.target.result;
    //         this.newImg = this.imageUrll; // Set newImg here
    //     };

    //     reader.readAsDataURL(selectedFile);
    // } else {
    //     this.imageUrll = ''; // Clear the URL if no image is selected
    //     this.newImg = '';    // Clear newImg as well
    // }
}

}
