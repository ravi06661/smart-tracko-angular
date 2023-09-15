import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentService } from 'src/app/service/student.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-adminstudent',
  templateUrl: './adminstudent.component.html',
  styleUrls: ['./adminstudent.component.scss']
})
export class AdminstudentComponent implements OnInit{

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  students:StudentDetails[]=[];
  totalStudent:number=0;
  search:string=''
  


  constructor(private stuentService:StudentService,private utilityService: UtilityServiceService){}
  ngOnInit(): void {
   this.getAllStudent(0,15);
  }
                                                                 
  public getAllStudent(page: Number, size: number) {
    this.stuentService.getAllStudent(page,size).subscribe(
      (data: any) => {
        this.students = data.response
       this.totalStudent=data.totalElements
      }
    )
  }
  public onChangePage(event: any) {
    this.getAllStudent(event.pageIndex, event.pageSize);
  }

  public searchStudentByName(){
    if(this.search==''){
      this.getAllStudent(0,15);
    }else{
    this.stuentService.searchStudentByName(this.search).subscribe(
      (data: any) => {
        this.students = data
        this.totalStudent=data.totalElements
      }
    )
  }}
}
