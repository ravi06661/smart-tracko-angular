import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fees } from 'src/app/entity/fees';
import { FeesPay } from 'src/app/entity/fees-pay';
import { FeesPayService } from 'src/app/service/fees-pay.service';
import { FeesService } from 'src/app/service/fees.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-fees-pending',
  templateUrl: './admin-fees-pending.component.html',
  styleUrls: ['./admin-fees-pending.component.scss']
})
export class AdminFeesPendingComponent implements OnInit{


  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  feesPays:FeesPay=new FeesPay();
  feeses:Fees[]=[];
  fees:Fees=new Fees();
  totalNumberOfFeesPay:number=0
  feesId:number=0;
  startDate='';
  endDate='';
  search='';
  feesList=0;
  pendingListLength:number=0;
constructor(private feesPayService:FeesPayService,private router:Router,private route: ActivatedRoute,private feesService:FeesService,private utilityService:UtilityServiceService,private el: ElementRef ){}

ngOnInit(): void {
  this.getAllfeesPayList(0,8);
}



public getAllfeesPayList(page:Number,size:number){
  this.feesPayService.feesPendingList(page,size).subscribe(
    (data:any)=>{
      this.feeses=data.response;
      this.feesList=data.totalElements
      this.pendingListLength=this.feeses.length
    }
  )
}
public onChangePage(event: any) {
  this.getAllfeesPayList(event.pageIndex, event.pageSize);
  this.pendingListLength=this.feeses.length
}

feesPay(){
  // this.feesId = this.route.snapshot.params[('feesId')];
 this.feesPays.feesPayAmount = Number(this.removeLeadingZeros(String(this.feesPays.feesPayAmount)));
  this.feesPayService.feesPay(this.feesPays).subscribe( 
    
    (data:any)=>{
      this.feesPays.fees.feesId=data.feesId
      const Toast = Swal.mixin({
        
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
      Toast.fire({
        icon: 'success',
        title: 'Fees Pay success !!'
      }).then(e => {
        this.feesPays = new FeesPay
        this.getAllfeesPayList(0,8);
       // this.router.navigate(['/admin/payfees']);
      })
    },
    (err) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
      Toast.fire({
        icon: 'error',
        title: 'Pay Amount is greater than remainingfees !!'
      })
    }
  )
}





removeLeadingZeros(input: string): string {
  return input.replace(/^0+/, '');
}

public getFeesById(feesId:number){
  // this.feesId = this.route.snapshot.params[('feesId')];
  this.feesService.findByFeesId(feesId).subscribe({
    next:(data:any)=>{
     this.fees = data
     console.log(this.fees);
     
     this.feesPays.fees =this.fees
     
     
      
    }
  })
}

public searchByName(){

  if(this.search==='')
  this.getAllfeesPayList(0,8);
else{
  this.feesService.searchByName(this.search,'Pending').subscribe(
    (data:any)=>{
      this.feeses=data;
      this.feesList=data.totalElements;
      this.pendingListLength=this.feeses.length
    }
  )
}
}

public findByGivenDate(){
  if(this.startDate==='' && this.endDate === ''){
    this.getAllfeesPayList(0,8);
  }else{
    this.feesService.findByDate(this.startDate,this.endDate,'Pending').subscribe(
      (data:any)=>{
        this.feeses=data;
        this.feesList-data.totalElements
        this.pendingListLength=this.feeses.length
      }
    )
  }
}


}
