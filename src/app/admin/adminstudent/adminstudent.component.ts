import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { Course } from 'src/app/entity/course';
import { StudentDetails } from 'src/app/entity/student-details';
import { TechnologyStack } from 'src/app/entity/technology-stack';
import { CourseRequest } from 'src/app/payload/course-request';
import { CourseServiceService } from 'src/app/service/course-service.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { TechnologyStackService } from 'src/app/service/technology-stack-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

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
  id: number | null = null;
  courseId:number = 0
  studentId:number=0;
   newStudent:StudentDetails=new StudentDetails();
   courses:Course[]=[];
   courseRequest:CourseRequest = new CourseRequest();
   course:Course=new Course();
   techImages:TechnologyStack[] = [];
   imageName = '';
   imageUrlTec = this.utilityService.getBaseUrl()+"/file/getImageApi/technologyStackImage/";

   selectedCourse: number=0;

  constructor(private stuentService:StudentService,private utilityService: UtilityServiceService,private courseService:CourseServiceService,private techService:TechnologyStackService,private activateRoute:ActivatedRoute
    ,private loginService:LoginService){}
  ngOnInit(): void {
    this.courseId=this.activateRoute.snapshot.params[('courseId')];
   this.getAllStudent(0,15);
   this.getAllCourse();
   this.getAllTechImages();
  
  
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

  public getAllCourse(){
    this.courseService.getAllUpgradeCourse().subscribe(
      (
        (data:any)=>{
          this.courses=data          
       
          
        }
      )
    )
  }
  public getAllTechImages(){
    this.techService.getAllTechnologyStack().subscribe({
      next:(data:any)=>{
        this.techImages = data
      }
    });
  }

  public upgradeCourseOfStudent(courseId:number){


  //   this.courseService.upgradeStudentCourse(this.newStudent.studentId,this.selectedCourse).subscribe( 
  //     (data:any)=>{
  //       this.newStudent=data
  //       const Toast = Swal.mixin({
          
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 1500,
  //         timerProgressBar: true,
  //       })
  //       Toast.fire({
  //         icon: 'success',
  //         title: 'Fees Pay success !!'
  //       }).then(e => {
  //         this.newStudent=new StudentDetails
  //          this.getAllStudent(0,15)
  //        // this.router.navigate(['/admin/payfees']);
  //       })
  //     },
  //     (err) => {
  //       const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 500,
  //         timerProgressBar: true,
  //       })
  //       Toast.fire({
  //         icon: 'error',
  //         title: 'failed !!'
  //       })
  //     }
  //   )
  // }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
     
      if (result.isConfirmed) {

        this.courseService.upgradeStudentCourse(this.newStudent.studentId,this.selectedCourse).subscribe({
          next:(res:any)=>{
            
            this.newStudent=res
          }
          })
        Swal.fire('Saved!', '', 'success')
        this.newStudent=new StudentDetails
        this.getAllStudent(0,15)
      } else if (result.isDenied) {
        
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  public check(id:number){
    if(this.course.courseId == id)
      return true
    return false;
  }

  selectCourse(courseId:number): void {
    this.selectedCourse = courseId;
  }
}
