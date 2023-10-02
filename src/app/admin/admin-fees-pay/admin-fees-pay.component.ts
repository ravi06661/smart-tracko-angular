import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
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
  feesPayes:FeesPay[]=[];
  fees:Fees=new Fees();
  totalNumberOfFeesPay:number=0
  feesId:number=0;
  payId:number=0;
  feesList = 0;
  fullName = '';
  endDate = '';
  startDate = '';
  updatePaidFeesFrom:FormGroup
  
constructor(private feesPayService:FeesPayService,private router:Router,private route: ActivatedRoute,private feesService:FeesService,private utilityService:UtilityServiceService,private formBuilder:FormBuilder){
  this.updatePaidFeesFrom = this.formBuilder.group({
    feesPayAmount: ['', Validators.required],
    payDate: ['', Validators.required],
    recieptNo: ['', Validators.required],
    description: ['', Validators.required]
  });
}
ngOnInit(): void {
  this.getAllfeesPayList(0,8);
  
}

public getAllfeesPayList(page:Number,size:number){
  this.feesPayService.feesPayList(page,size).subscribe(
    (data:any)=>{
      this.feesPayes=data.response;
      this.feesList=data.totalElements
    }
  )
}
public onChangePage(event: any) {
  this.getAllfeesPayList(event.pageIndex, event.pageSize);
}

public getFeesPayByPayId(payId:number){
  // this.payId = this.route.snapshot.params[('payId')];
  this.feesPayService.findByPayId(payId).subscribe({
    next:(data:any)=>{
     this.feesPays = data
     this.payId=this.feesPays.payId
    }
  })
}

public searchByName(){

  if(this.fullName=='')
  this.getAllfeesPayList(0,8);
else{
  this.feesPayService.searchByNameInFeesPayList(this.fullName).subscribe(
    (data:any)=>{
      // this.feeses=data;
      this.feesPayes=data
      this.feesList=data.totalElements;
    }
  )
}
}

public findByGivenDate(){
  if(this.startDate=='' && this.endDate == ''){
    this.getAllfeesPayList(0,8);
  }else{
    this.feesPayService.searchByMonthInFeesPayList(this.startDate,this.endDate).subscribe(
      (data:any)=>{
        this.feesPayes=data;

        this.feesList-data.totalElements
      }
    )
  }
}


isFieldInvalidForPaidFeesForm(fieldName: string): boolean {
  const field = this.updatePaidFeesFrom.get(fieldName);
  return field ? field.invalid && field.touched : false;
}

public paidFeesDetailsFormSubmition() {
  Object.keys(this.updatePaidFeesFrom.controls).forEach(key => {
    const control = this.updatePaidFeesFrom.get(key);
    if (control) {
      control.markAsTouched();
    }
  });
  const firstInvalidControl = document.querySelector('input.ng-invalid');
  if (firstInvalidControl) {
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

public updateFeesPay(){
  this.updatePaidFeesFrom.markAllAsTouched();
  if (this.updatePaidFeesFrom.valid)
    // this.feesId = this.route.snapshot.params[('feesId')];
    this.feesPayService.updateFeesPay(this.feesPays).subscribe( 
      (data:any)=>{
        this.feesPays=data
        const Toast = Swal.mixin({
          
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'success',
          title: 'Update Fees Pay success !!'
        }).then(e => {
          this.feesPays = new FeesPay
          this.getAllfeesPayList(0,8);
          this.router.navigate(['/admin/payfees']);
        })
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: 'error',
          title: 'failed !!'
        })
      }
    )
  }
//   Swal.fire({
//     title: 'Do you want to save the changes?',
//     showDenyButton: true,
//     showCancelButton: true,
//     confirmButtonText: 'Save',
//     denyButtonText: `Don't save`,
//   }).then((result) => {
//     /* Read more about isConfirmed, isDenied below */
//     if (result.isConfirmed) {

//       this.feesPayService.updateFeesPay(this.feesPays).subscribe({
//         next:(res:any)=>{
          
//          this.feesPays=res
//         }
//         })
//       Swal.fire('Saved!', '', 'success')
//       //  this.router.navigate(['/admin/payfees'])
//       this.feesPays=new FeesPay;
//      this.getAllfeesPayList(0,8);
//     } else if (result.isDenied) {
//       this.getFeesPayByPayId(this.payId)
//       Swal.fire('Changes are not saved', '', 'info')
//     }
//   })
// }

}
