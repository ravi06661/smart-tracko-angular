import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fees } from 'src/app/entity/fees';
import { FeesPay } from 'src/app/entity/fees-pay';
import { FeesPayService } from 'src/app/service/fees-pay.service';
import { FeesService } from 'src/app/service/fees.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-fees-pay',
  templateUrl: './admin-fees-pay.component.html',
  styleUrls: ['./admin-fees-pay.component.scss']
})
export class AdminFeesPayComponent implements OnInit{
 
  BASE_URL = this.utilityService.getBaseUrl();
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  feesPays:FeesPay=new FeesPay();
  feeses:Fees[]=[];
  fees:Fees=new Fees();
  totalNumberOfFeesPay:number=0
  feesId:number=0;
constructor(private feesPayService:FeesPayService,private router:Router,private route: ActivatedRoute,private feesService:FeesService,private utilityService:UtilityServiceService ){}
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
  this.feesId = this.route.snapshot.params[('feesId')];
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
        this.getAllfeesPayList(0,15);
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
        title: 'failed !!'
      })
    }
  )
}
public getFeesById(feesId:number){
  // this.feesId = this.route.snapshot.params[('feesId')];
  this.feesService.findByFeesId(feesId).subscribe({
    next:(data:any)=>{
     this.fees = data
     this.feesPays.fees =this.fees
     
     
      
    }
  })
}

}
