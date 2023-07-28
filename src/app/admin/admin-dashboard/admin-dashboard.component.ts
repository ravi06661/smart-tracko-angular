import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{

  constructor(private localst:LocationStrategy) {}

  ngOnInit(): void {
    this.preventBackButton();
  }

  public preventBackButton(){
    history.pushState(null,'',location.href);
    this.localst.onPopState(()=>{
      history.pushState(null,'',location.href);
    });
  }


}
