import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginQRComponent } from './pages/login-qr/login-qr.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MycourseComponent } from './pages/mycourse/mycourse.component';
import { TaskandassignmentsComponent } from './pages/taskandassignments/taskandassignments.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { JobalertComponent } from './pages/jobalert/jobalert.component';
import { NewsandeventsComponent } from './pages/newsandevents/newsandevents.component';
import { LeftSideBarComponent } from './sidebar/left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './sidebar/right-side-bar/right-side-bar.component';
import { ProfileBarComponent } from './sidebar/profile-bar/profile-bar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { IgxCalendarModule,IgxSnackbarModule,IgxCardModule, IgxDialogModule } from "igniteui-angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HammerModule } from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { authInterceptorProvider } from './auth.interceptor';
import { FormsModule } from '@angular/forms';
import { TestingComponent } from './pages/testing/testing.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminSideBarComponent } from './admin/admin-side-bar/admin-side-bar.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminJobAlertComponent } from './admin/admin-job-alert/admin-job-alert.component';
import { AdminNewsAndEventComponent } from './admin/admin-news-and-event/admin-news-and-event.component';
import { AdminCoursesComponent } from './admin/admin-courses/admin-courses.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CalenderComponent } from './pages/calender/calender.component';
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






@NgModule({
  declarations: [
    AppComponent,
    LoginQRComponent,
    HomeComponent,
    DashboardComponent,
    MycourseComponent,
    TaskandassignmentsComponent,
    AttendanceComponent,
    JobalertComponent,
    NewsandeventsComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    ProfileBarComponent,
    TestingComponent,
    AdminPanelComponent,
    AdminSideBarComponent,
    AdminDashboardComponent,
    AdminJobAlertComponent,
    AdminNewsAndEventComponent,
    AdminCoursesComponent,
    AdminLoginComponent,
    NotFoundComponent,
    CalenderComponent,
    StudyComponent,
    SubjectdetailsComponent,
    AssignmentDetailsComponent,
    TaskComponent,
    TaskDetailsComponent,
    JobDescriptionComponent,
    InternshipsDescriptionComponent,
    NewsandEventsDescriptionComponent,
    CheckincheckoutComponent,
    ChapterComponent,
    QuestionsComponent,
    AdminAssignmentsComponent,
    AdminCreateAssignmentsComponent,
    AdminEditAssignmentsComponent,
    AdminAttendanceComponent,
   
       
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    IgxCalendarModule,
	  BrowserAnimationsModule,
    IgxCardModule,
    IgxSnackbarModule,
    HammerModule,
    IgxDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    FormsModule,
    CKEditorModule,
    MatPaginatorModule,
    NgxPaginationModule,
    NgApexchartsModule,
    FullCalendarModule,

  ],
  providers: [DatePipe,authInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
