import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { PieChart } from 'src/app/charts/pie-chart';
import { Announcement } from 'src/app/entity/announcement';
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
import { WebsocketServiceDiscussionFormService } from 'src/app/service/websocket-service-discussion-form-service.service';
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
  unLockAssignments: any// Assignment[] = []
  lockAssignments: number[] = []
  assignmentId: number = 0;
  unLockAssignment: Assignment = new Assignment

  constructor(private router: Router, private taskService: TaskServiceService, private assignmentService: AssignmentServiceService, private activateRoute: ActivatedRoute,  private studentService: StudentService, private leaveService: LeaveService, private feesPayService: FeesPayService) {
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
        // this.chartOptions.series = [data.presentsCount, 0, data.leavesCount];
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
    this.assignmentService.getAllLockedAndUnlockedAssignment(this.studentId).subscribe(
      (data: any) => {
        this.unLockAssignments = data.unLockedAssignment;
        //  this.lockAssignments = data.lockedAssignment;
        this.lockAssignments = Array(data.lockedAssignment).fill(0).map((x, i) => i);
        this.unLockAssignments.forEach(() => {
          this.assignmentTaskVisibility.push(false);
        });
      }
    )
  }
  public getAssignment(id: number) {
    this.assignmentId = id;
    this.unLockAssignment = this.unLockAssignments.find((assignment: any) => assignment.id === id) as Assignment;
  }
  assignmentTaskVisibility: boolean[] = [];

  toggleAssignment(index: number): void {
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
  progressWidth: string = '';
  calculatePercentages(num1: number, num2: number) {

    if (num2 == 0)
      return 0;
    else
      return Math.floor((num1 / num2) * 100);
  }

  public pageRenderUsingRouterLink1(path: string, questionId: number) {
    const dataParams = {
      id: questionId,
      type: "assignmentQuestion"
    };
    this.router.navigate([path], {
      queryParams: dataParams
    });
  }

}
