import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginQRComponent } from './pages/login-qr/login-qr.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MycourseComponent } from './pages/mycourse/mycourse.component';
import { LeftSideBarComponent } from './sidebar/left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './sidebar/right-side-bar/right-side-bar.component';
import { TaskandassignmentsComponent } from './pages/taskandassignments/taskandassignments.component';
import { NewsandeventsComponent } from './pages/newsandevents/newsandevents.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { JobalertComponent } from './pages/jobalert/jobalert.component';
import { TestingComponent } from './pages/testing/testing.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminJobAlertComponent } from './admin/admin-job-alert/admin-job-alert.component';
import { AdminNewsAndEventComponent } from './admin/admin-news-and-event/admin-news-and-event.component';
import { AdminCoursesComponent } from './admin/admin-courses/admin-courses.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { StudentGuardGuard } from './student-guard.guard';
import { AdminGuardGuard } from './admin-guard.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { StudyComponent } from './pages/study/study.component';
import { SubjectdetailsComponent } from './pages/subjectdetails/subjectdetails.component';
import { AssignmentDetailsComponent } from './pages/assignment-details/assignment-details.component';
import { TaskComponent } from './pages/task/task.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { JobDescriptionComponent } from './pages/job-description/job-description.component';
import { InternshipsDescriptionComponent } from './pages/internships-description/internships-description.component';
import { NewsandEventsDescriptionComponent } from './pages/newsand-events-description/newsand-events-description.component';
import { CheckincheckoutComponent } from './pages/checkincheckout/checkincheckout.component';
import { ChapterComponent } from './pages/chapter/chapter.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { AdminAssignmentsComponent } from './admin/admin-assignments/admin-assignments.component';
import { AdminCreateAssignmentsComponent } from './admin/admin-create-assignments/admin-create-assignments.component';
import { AdminEditAssignmentsComponent } from './admin/admin-edit-assignments/admin-edit-assignments.component';
import { AdminAttendanceComponent } from './admin/admin-attendance/admin-attendance.component';
import { AdminTaskComponent } from './admin/admin-task/admin-task.component';
import { AdminEditTaskComponent } from './admin/admin-edit-task/admin-edit-task.component';
import { AdminCreateNewJobComponent } from './admin/admin-create-new-job/admin-create-new-job.component';
import { AdminCreateNewsAndEventsComponent } from './admin/admin-create-news-and-events/admin-create-news-and-events.component';
import { AnnouncementsComponent } from './admin/announcements/announcements.component';
import { CreateAnnouncementsComponent } from './admin/create-announcements/create-announcements.component';
import { AdminstudentComponent } from './admin/adminstudent/adminstudent.component';
import { AdminCreateTaskComponent } from './admin/admin-create-task/admin-create-task.component';
import { StudentProfileComponent } from './admin/student-profile/student-profile.component';
import { AdminStudentRegistrationComponent } from './admin/admin-student-registration/admin-student-registration.component';
import { AdminSubmissionComponent } from './admin/admin-submission/admin-submission.component';

const routes: Routes = [
  {path:'',component:LoginQRComponent,pathMatch:'full'},
  {path:'login',component:AdminLoginComponent,pathMatch:'full'},
  {path:'student',component:HomeComponent, canActivate:[StudentGuardGuard],children:[
    {path:'',component:DashboardComponent,pathMatch:'full'},
    {path:'checkInCheckOut',component:CheckincheckoutComponent,pathMatch:'full'},
    {path:'study',component:StudyComponent,pathMatch:'full'},
    {path:'chapter',component:ChapterComponent,pathMatch:'full'},
    {path:'chapterDetails',component:SubjectdetailsComponent,pathMatch:'full'},
    {path:'mycourse',component:MycourseComponent,pathMatch:'full'},
    {path:'assignmentdetails',component:AssignmentDetailsComponent,pathMatch:'full'},
    {path:'taskAndAssignment',component:TaskandassignmentsComponent,pathMatch:'full'},
    {path:'task',component:TaskComponent,pathMatch:'full'},
    {path:'taskdetails',component:TaskDetailsComponent,pathMatch:'full'},
    {path:'newsAndEvent',component:NewsandeventsComponent,pathMatch:'full'},
    {path:'newandseventsdescription/:id',component:NewsandEventsDescriptionComponent,pathMatch:'full'},
    {path:'attendance',component:AttendanceComponent,pathMatch:'full'},
    {path:'jobalert',component:JobalertComponent,pathMatch:'full'},
    {path:'jobdescription/:id',component:JobDescriptionComponent,pathMatch:'full'},
    {path:'internshipsdescription/:id',component:InternshipsDescriptionComponent,pathMatch:'full'},
    {path:'testing',component:TestingComponent,pathMatch:'full'}
  ]},
  {path:'questions',component:QuestionsComponent,pathMatch:'full'},
  {
    path:'admin',component:AdminPanelComponent,canActivate:[AdminGuardGuard],children:[
      {path:'',component:AdminDashboardComponent,pathMatch:'full'},
      {path:'assignments',component:AdminAssignmentsComponent,pathMatch:'full'},
      {path:'createassignments',component:AdminCreateAssignmentsComponent,pathMatch:'full'},
      {path:'editassignments',component:AdminEditAssignmentsComponent,pathMatch:'full'},
      {path:'task',component:AdminTaskComponent,pathMatch:'full'},
      {path:'createtask',component:AdminCreateTaskComponent,pathMatch:'full'},
      {path:'edittask',component:AdminEditTaskComponent,pathMatch:'full'},
      {path:'attendance',component:AdminAttendanceComponent,pathMatch:'full'},
      {path:'jobalert',component:AdminJobAlertComponent,pathMatch:'full'},
      {path:'createjob',component:AdminCreateNewJobComponent,pathMatch:'full'},
      {path:'newsAndEvent',component:AdminNewsAndEventComponent,pathMatch:'full'},
      {path:'createnewsAndEvent',component:AdminCreateNewsAndEventsComponent,pathMatch:'full'},
      {path:'announcements',component:AnnouncementsComponent,pathMatch:'full'},
      {path:'createannouncements',component:CreateAnnouncementsComponent,pathMatch:'full'},
      {path:'student',component:AdminstudentComponent,pathMatch:'full'},
      {path:'mycourse',component:AdminCoursesComponent,pathMatch:'full'},
      {path:'studentprofile/:studentId',component:StudentProfileComponent,pathMatch:'full'},
      {path:'studentregistration',component:AdminStudentRegistrationComponent,pathMatch:'full'},
      {path:'submission',component:AdminSubmissionComponent,pathMatch:'full'}
      
    ]
  },
  {path:'**',component:NotFoundComponent,pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
