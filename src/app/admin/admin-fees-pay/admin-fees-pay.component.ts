import { Component, OnInit } from '@angular/core';
import { Fees } from 'src/app/entity/fees';
import { FeesPay } from 'src/app/entity/fees-pay';
import { FeesPayService } from 'src/app/service/fees-pay.service';

@Component({
  selector: 'app-admin-fees-pay',
  templateUrl: './admin-fees-pay.component.html',
  styleUrls: ['./admin-fees-pay.component.scss']
})
export class AdminFeesPayComponent implements OnInit{
 
  feesPays:FeesPay=new FeesPay();
  feeses:Fees[]=[];
  totalNumberOfFeesPay:number=0
constructor(private feesPayService:FeesPayService){}
ngOnInit(): void {
  this.getAllfeesPayList(0,15);
}

public getAllfeesPayList(page:Number,size:number){
  this.feesPayService.feesPayList(page,size).subscribe(
    (data:any)=>{
      this.feeses=data.response;
      this.totalNumberOfFeesPay=data.totalElements
    }
  )
}
public onChangePage(event: any) {
  this.getAllfeesPayList(event.pageIndex, event.pageSize);
}

feesPay(){
  this.feesPayService.feesPay(this.feesPays).subscribe(
    (data:any)=>{
      this.feesPay=data
    }
  )
}
}
