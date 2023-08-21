import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
import { StudentDetails } from 'src/app/entity/student-details';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ChartComponent } from 'ng-apexcharts';
import { log } from 'console';
import { FeesService } from 'src/app/service/fees.service';
import { an } from '@fullcalendar/core/internal-common';

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
  admissionData: [] = []
  monthCategories: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  years: number[] = [];
  admissionYear: number = 0;
  feesYear: number = 0;
  admissionMap = new Map<number, number>();
  feesMap = new Map<number, number>();
  constructor(private elementRef: ElementRef, private localst: LocationStrategy, private studentService: StudentService, private utilityService: UtilityServiceService, private feesService: FeesService) {
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

    this.years = this.generateYearsArray(2000, new Date().getFullYear());
    this.admissionYear = new Date().getFullYear();
    this.feesYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.preventBackButton();
    this.getNewRegistrationStudents();
    this.getAdmissinonDataByWiseForYear(this.admissionYear);
    this.getFeesCollectionMonthAndYearWise(2023);
    //this.getAdmissionBarData()
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
    this.studentService.getAdmissinonDataByWiseForYear(year).subscribe({
      next: (data: any) => {
        this.admissionMap = data
        this.getAdmissionBarChartData()
      }
    })
  }

  alet(year: number) {
    console.log(year)
  }

  public getAdmissionBarChartData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.admissionMap).map(([key, value]) => [parseInt(key), value]);
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.admissinonOptions.series[0].data = arr
    this.admissinonOptions.xaxis.categories = this.monthCategories
    window.dispatchEvent(new Event('resize'));
  }
  public getFessBarData() {
    let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const mapEntries: [number, number][] = Object.entries(this.feesMap).map(([key, value]) => [parseInt(key), value]);
    const resultMap: Map<number, number> = new Map<number, number>(mapEntries);
    for (const entry of resultMap.entries()) {
      arr[entry[0] - 1] = entry[1];
    }
    this.feesOptions.series[0].data = arr
    this.feesOptions.xaxis.categories = this.monthCategories
    window.dispatchEvent(new Event('resize'));
  }

  public generateYearsArray(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }

  public getFeesCollectionMonthAndYearWise(year: number) {
    this.feesService.getFeesCollectionMonthAndYearWise(year).subscribe(
      (data: any) => {
        this.feesMap = data.body
        this.getFessBarData();
      }
    )
  }
}

