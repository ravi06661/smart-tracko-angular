import { Component, OnInit } from '@angular/core';
import { Fees } from 'src/app/entity/fees';
import { FeesService } from 'src/app/service/fees.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-admin-fees-completed-list',
  templateUrl: './admin-fees-completed-list.component.html',
  styleUrls: ['./admin-fees-completed-list.component.scss']
})
export class AdminFeesCompletedListComponent implements OnInit{

  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';

  feeses:Fees[]=[];
  feesList:number=0
  search:string=''
  startDate:string=''
  endDate:string=''
  constructor(private feesService:FeesService,private utilityService:UtilityServiceService ){}
  ngOnInit(): void {
    this.getAllCompletedFeesList(0,15);
  }
  
  public getAllCompletedFeesList(page:number,size:number){
    this.feesService.getAllCompletedFeesList(page,size).subscribe(
      (data:any)=>{
        this.feeses=data.response
        this.feesList=data.totalElements;
      }
    )
  }
  public onChangePage(event: any) {
    this.getAllCompletedFeesList(event.pageIndex, event.pageSize);
  }

  public searchByName(){

    if(this.search=='')
    this.getAllCompletedFeesList(0,15);
  else{
    this.feesService.searchByName(this.search,'Completed').subscribe(
      (data:any)=>{
        this.feeses=data;
        this.feesList=data.totalElements;
      }
    )
  }
  }
  
  public findByGivenDate(){
    if(this.startDate=='' && this.endDate == ''){
      this.getAllCompletedFeesList(0,15);
    }else{
      this.feesService.findByDate(this.startDate,this.endDate,'Completed').subscribe(
        (data:any)=>{
          this.feeses=data;
          this.feesList-data.totalElements
        }
      )
    }
  }

}
