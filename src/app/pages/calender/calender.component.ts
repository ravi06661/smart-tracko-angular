import { map } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { error } from 'console';
import { LoginService } from 'src/app/service/login.service';
import { StudentService } from 'src/app/service/student.service';
import { ChartComponent } from 'ng-apexcharts';

export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  colors:any
  legend:any

};
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})

export class CalenderComponent {
  
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> ;
  currentMonth: number;
  currentYear: number;
  months: string[];
  days: string[];
  Present: number[]=[];
  Absent: number[]=[];
  Leaves: number[]=[];

  constructor(private studentService:StudentService,private loginService:LoginService) {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
     this.Present=[];
     this.Absent=[];
      this.Leaves=[];

      this.chartOptions = {
        series: [100, 100, 100],
        chart: {
          type: "donut",
          toolbar: {
            show: false // Hide the default toolbar
          }
        },
        colors: ["#03a5fc", "#fc6f03", "#fc030b"],
        labels: ["Present", "Absent", "Leaves"],
        legend: {
          position: "bottom", // Show the legend at the bottom
      // formatter: function (seriesName:any, opts:any) {
      //   const total = opts.w.globals.seriesTotals.reduce((a:any, b:any) => a + b, 0);
      //   const percent = ((opts.w.globals.series[opts.seriesIndex] / total) * 100).toFixed(2);
      //   return seriesName + ": " + percent + "%";
      // }
        },
      
        responsive: [

          {
            breakpoint: 480,
            options: {
              chart: {
                width: 280
                
              },
              legend:{
                position:'bottom'
              }
            }
          }
        ]
      };
      
  }

  ngOnInit(): void {
    this.getStudentCalenderData(this.currentMonth+1,this.currentYear);
    //this.showCalendar(this.currentMonth, this.currentYear);
    this.generateTableHeader();
  }

  ngDoCheck():void{
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  next(): void {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.getStudentCalenderData(this.currentMonth+1,this.currentYear);
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.getStudentCalenderData(this.currentMonth+1,this.currentYear);
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  public generateTableHeader(): void {
    const $dataHead = this.days.map(day => `<th data-days='${day}'>${day}</th>`).join("");
    const theadMonth = document.getElementById("thead-month");
    if (theadMonth) {
      theadMonth.innerHTML = $dataHead;
    }
  }

  showCalendar(month: number, year: number): void { 
    const firstDay = new Date(year, month).getDay();
    const tbl = document.getElementById("calendar-body");
    if (tbl) {
      tbl.innerHTML = "";
    }
    const monthAndYear = document.getElementById("monthAndYear");
    if (monthAndYear) {
      monthAndYear.innerHTML = `${this.months[month]} ${year}`;
    }
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          const cell = document.createElement("td");
          const cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > this.daysInMonth(month, year)) {
          break;
        } else {
          const cell = document.createElement("td");
          cell.setAttribute("data-date", String(date));
          cell.setAttribute("data-month", String(month + 1));
          cell.setAttribute("data-year", String(year));
          cell.setAttribute("data-month_name", this.months[month]);
          cell.className = "date-picker";
          const adddata = document.getElementsByClassName("date-picker");
          cell.innerHTML = `<span>${date}</span>`;
          if (date === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            cell.className = "date-picker selected"; 
          }
          if (this.Present.includes(Number(date)) && year === this.currentYear && month === this.currentMonth) {
            cell.className = "date-picker present";
          }
          if (this.Absent.includes(Number(date)) && year === this.currentYear && month === this.currentMonth) {
            cell.className = "date-picker absent";
          }
          if (this.Leaves.includes(Number(date)) && year === this.currentYear && month === this.currentMonth) {
            cell.className = "date-picker leaves";
          }
          row.appendChild(cell);
          date++;
        }
      }
      if (tbl) {
        tbl.appendChild(row);
      }
    }
  }

  daysInMonth(iMonth: number, iYear: number): number {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  public getStudentCalenderData(month:number,year:number){
    this.studentService.getCalenderData(this.loginService.getStudentId(),month,year).subscribe({
      next:(data:any)=>{

        this.Present = data.StudentCalenderData.present;
        this.Absent = data.StudentCalenderData.absent;
        this.Leaves = data.StudentCalenderData.leaves;
      },
      error:(err)=>{

      }
    })
  }

}
