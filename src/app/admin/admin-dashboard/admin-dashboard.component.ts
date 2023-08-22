import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
import { StudentDetails } from 'src/app/entity/student-details';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { ChartComponent } from 'ng-apexcharts';
import { log } from 'console';
import { FeesService } from 'src/app/service/fees.service';
import { an } from '@fullcalendar/core/internal-common';
import { BarChart } from 'src/app/charts/bar-chart';
import { PieChart } from 'src/app/charts/pie-chart';
import { DonutChart } from 'src/app/charts/donut-chart';

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  xaxis: any;
  colors: any;
  yaxis: any;
  legend: any;
  responsive: any;
  labels: any;
  stroke :any;
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public admissinonOptions: Partial<ChartOptions>;
  public feesOptions: Partial<ChartOptions>;
  public feesPieOptions: Partial<ChartOptions>;
  public attendanceOptions: Partial<ChartOptions>;
  students: StudentDetails[] = []
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/'
  admissionData: [] = []
  years: number[] = [];
  admissionYear: number = 0;
  feesYear: number = 0;
  admissionMap = new Map<number, number>();
  feesMap = new Map<number, number>();
  admissionBar:BarChart = new BarChart();
  feesBar:BarChart = new BarChart();
  pieChart:PieChart = new PieChart();
  attendanceChart:DonutChart = new DonutChart();
  totaOnleaves = 0;
  totalAbsent = 0;
  totalPresent = 0;

  constructor(private elementRef: ElementRef, private localst: LocationStrategy, private studentService: StudentService, private utilityService: UtilityServiceService, private feesService: FeesService) {
    this.admissinonOptions = this.admissionBar.chartOptions

    this.feesOptions = this.feesBar.chartOptions
    this.feesOptions.series[0].name = 'Fees'

    this.feesPieOptions = this.pieChart.chartOptions
    this.feesPieOptions.labels = ['Total','Collected','Pending']
    this.feesPieOptions.colors = ['#49cf9f','#4daaf8','#f6c453']

    this.attendanceOptions = this.attendanceChart.chartOptions
    this.attendanceChart.chartOptions.colors = ['#49cf9f','#f0845d','#8079ff']
    this.attendanceChart.chartOptions.labels = ["Present", "Absent", "Leaves"]

    this.years = this.generateYearsArray(2000, new Date().getFullYear());
    this.admissionYear = new Date().getFullYear();
    this.feesYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.preventBackButton();
    this.getNewRegistrationStudents();
    this.getAdmissinonDataByWiseForYear(this.admissionYear);
    this.getFeesCollectionMonthAndYearWise(this.feesYear);
    this.getAbsents();
    this.getActiveLeaves();
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

  public getChartData() {
    this.attendanceOptions.series = [ this.totalPresent,this.totalAbsent, this.totaOnleaves]
  }

  public getAbsents() {
    this.studentService.getTodayStudentAbsentData().subscribe(
      (data: any) => {
        this.totalAbsent = data.totalAbsent.length;
        this.totalPresent = data.totalPresent
        this.getChartData();
      }
    )
  }

  public getActiveLeaves() {
    this.studentService.getStudentAtiveLeaves().subscribe(
      (data: any) => {
        this.totaOnleaves = data.length;
        this.getChartData();
      }
    )
  }
}

