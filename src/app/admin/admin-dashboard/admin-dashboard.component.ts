import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
import { StudentDetails } from 'src/app/entity/student-details';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ChartComponent } from 'ng-apexcharts';
import { log } from 'console';

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  xaxis: any;
  colors: any;
  yaxis: any;
};

export type ChartOptions2 = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  xaxis: any;
  colors: any;
  yaxis: any;
};
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public admissinonOptions: Partial<ChartOptions>;
  public feesOptions: Partial<ChartOptions2>;
  students: StudentDetails[] = []
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/'
  admissionData: string[] = []
  monthCategories: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  selectedYear: number | undefined; // To store the selected year
  years: number[] | undefined;


  constructor(private elementRef: ElementRef, private localst: LocationStrategy, private studentService: StudentService, private utilityService: UtilityServiceService) {
    this.admissinonOptions = {
      series: [
        {
          name: "Student",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.monthCategories
      },
      colors: ['#ffffff']
    };
    this.feesOptions = {
      series: [
        {
          name: "Fees",
          data: [2, 10, 4, 15, 12, 20, 14, 7, 6, 9, 10, 3]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.monthCategories
      },
      colors: ['#ffffff']
    };

    this.years = this.generateYearsArray(2000, new Date().getFullYear());
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.preventBackButton();
    this.getNewRegistrationStudents();
    this.getAdmissinonDataByWiseForYear(new Date().getFullYear());
    this.getAdmissionBarData()
  }

  public preventBackButton() {
    history.pushState(null, '', location.href);
    this.localst.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  public getNewRegistrationStudents() {
    this.studentService.getAllStudent(0, 15).subscribe({
      next: (data: any) => {
        this.students = data.response;
      }
    })
  }

  public getAdmissinonDataByWiseForYear(year: number) {
    //this.admissinonOptions.series[0].data = this.admissionData
    // this.admissinonOptions.xaxis.categories = this.monthCategories
    this.studentService.getAdmissinonDataByWiseForYear(year).subscribe({
      next: (data: any) => {
        this.admissionData = data.count;
        //this.monthCategories = data.months
        this.admissinonOptions.series.data = data.count;
        //this.admissinonOptions.xaxis.categories = data.month;
        this.getAdmissionBarData()
      }
    })
  }

  public getAdmissionBarData() {
    this.admissinonOptions.series[0].data = this.admissionData
    this.admissinonOptions.xaxis.categories = this.monthCategories
  }

  public generateYearsArray(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }
}
