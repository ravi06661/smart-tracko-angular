import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { PieChart } from 'src/app/charts/pie-chart';
import { Assignment } from 'src/app/entity/assignment';
import { AssignmentSubmission } from 'src/app/entity/assignment-submission';
import { AttendanceLog } from 'src/app/entity/attendance-log';
import { FeesPay } from 'src/app/entity/fees-pay';
import { Leaves } from 'src/app/entity/leaves';
import { StudentDetails } from 'src/app/entity/student-details';
import { StudentTaskSubmittion } from 'src/app/entity/student-task-submittion';
import { AssignmentServiceService } from 'src/app/service/assignment.service';
import { FeesPayService } from 'src/app/service/fees-pay.service';
import { LeaveService } from 'src/app/service/leave.service';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { TaskServiceService } from 'src/app/service/task-service.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';


export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  legend: any;
  colors: any;
  stroke: any;
};

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  studentId: number = 0;
  student: StudentDetails = new StudentDetails();
  attendanceLog: AttendanceLog[] = [];
  leavesList: Leaves[] = [];
  leaveMonth = 'Month';
  feesPay: FeesPay[] = [];
  pieChart: PieChart = new PieChart();
  assignmentSubmissionsList: AssignmentSubmission[] = []
  assignmentSubmissionObj: AssignmentSubmission = new AssignmentSubmission
  taskSubmissionList: StudentTaskSubmittion[] = []
  taskSubmissionObj: StudentTaskSubmittion = new StudentTaskSubmittion
  unLockAssignments: Assignment[] = []
  lockAssignments: Assignment[] = []
  ATTACHMENT_URL = this.BASE_URL + '/file/download/taskAndAssignmentAttachment/'
  assignmentId: number = 0;
  unLockAssignment: Assignment = new Assignment
  constructor(private router: Router, private taskService: TaskServiceService, private assignmentService: AssignmentServiceService, private utilityService: UtilityServiceService, private activateRoute: ActivatedRoute,
    private studentService: StudentService, private leaveService: LeaveService, private feesPayService: FeesPayService, private loginService: LoginService) {
    this.chartOptions = this.pieChart.chartOptions;
  }

  ngOnInit(): void {
    this.studentId = this.activateRoute.snapshot.params[('studentId')];
    this.getStudentProfileData();
    this.getSubmitedAssignment();
    this.getSubmitedTaskByStudent();
    this.getAllAssignments();
  }

  public getStudentProfileData() {
    this.studentService.getStudentProfileData(this.studentId).subscribe({
      next: (data: any) => {
        this.student = data;
      }
    })
  }
  public updateStudent() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.updateStudent(this.student).subscribe({
          next: (res: any) => {
            this.student = res
          }
        })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        this.getStudentProfileData()
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  public getStudentOverAllAttendancesAndLeaves() {
    this.studentService.getStudentOverAllAttendancesAndLeave(this.studentId).subscribe({
      next: (data: any) => {
        this.attendanceLog = data.attendanceList;
        this.chartOptions.series = [data.presentsCount, 0, data.leavesCount];
      }
    })
  }

  public changeTimeFormat(time: any) {
    return moment(time, "HH:mm:ss").format("hh:mm:ss A");
  }

  public timerFormate(seconds: number) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  public getStudentLeaves() {
    this.leaveMonth = 'Month';
    this.leaveService.getStudentLeaves(this.studentId).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;

      }
    })
  }

  public getLeavesFilter(monthNo: number) {
    this.leaveMonth = moment(monthNo, "MM").format("MMMM");
    this.leaveService.getLeavesFiterData(this.studentId, monthNo).subscribe({
      next: (res: any) => {
        this.leavesList = res.leavesData.response;
      }
    })
  }

  public getAllTrasection() {
    this.feesPayService.getAllTransection(this.studentId).subscribe({
      next: (data: any) => {
        this.feesPay = data
      }
    })
  }
  public getSubmitedAssignment() {
    this.assignmentService.getSubmitedAssignmetByStudentId(this.studentId).subscribe({
      next: (data: any) => {
        this.assignmentSubmissionsList = data
        console.log(this.assignmentSubmissionsList);

      }
    })
  }
  public getSubmitedTaskByStudent() {
    this.taskService.getSubmitedTaskByStudent(this.studentId).subscribe({
      next: (data: any) => {
        this.taskSubmissionList = data
      }
    })
  }
  public getAllAssignments() {
    this.assignmentService.getAllLockedAndUnlockedAssignment(this.loginService.getStudentId()).subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        this.lockAssignments = data.lockedAssignment;
        this.temp();
      }
    )
  }
  public getAssignment(id: number) {
    this.assignmentId = id;
    this.unLockAssignment = this.unLockAssignments.find(assignment => assignment.id === id) as Assignment;
  }
  assignmentTaskVisibility: boolean[] = [];

  toggleAssignment(index: number): void {
    // Toggle the visibility of assignment tasks for the selected assignment
    this.assignmentTaskVisibility[index] = !this.assignmentTaskVisibility[index];
  }
  public pageRenderUsingRouterLink(path: string, questionId: number) {
    const dataParams = {
      assignmentId: this.assignmentId,
      questionId: questionId,
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

  //for counting total  completed assignment task
  AssignMap = new Map<number, number>();
  AssignSubmittionDates = new Map<number, Date>();
  public temp() {
    let count: number = 0;
    this.unLockAssignments.forEach(element => {
      element.assignmentQuestion.forEach(e => {
        if (this.assignmentSubmissionsList.find(e1 => e1.taskId === e.questionId)) {
          count += 1;
          let obj = this.assignmentSubmissionsList.find(e1 => e1.taskId === e.questionId) as AssignmentSubmission
          this.AssignSubmittionDates.set(e.questionId, obj.submissionDate);
        }
      })
      this.AssignMap.set(element.id, count);
      count = 0;
    });
  }
  public getTotalCompletedAssignmentCount(id: number) {
    return this.AssignMap.get(id);
  }
  public getAssignmentSubmissionDate(taskId: number) {
    return this.AssignSubmittionDates.get(taskId);
  }

  progressWidth: string = '';

  public calculatePercentages(num1: number, num2: number) {
    const totalCompleted = this.getTotalCompletedAssignmentCount(num1);
    let per
    if (totalCompleted !== undefined) {
      per = Math.floor(totalCompleted / num2 * 100);
      let obj = per * 7.29;
      this.progressWidth = obj.toString() + 'px';
    }
    return per;
  }
}
