import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  payFeesForm: FormGroup ;

constructor(private feesPayService:FeesPayService,private router:Router,private route: ActivatedRoute,private feesService:FeesService,private utilityService:UtilityServiceService,private formBuilder: FormBuilder ){
  this.payFeesForm = this.formBuilder.group({
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
  this.feesPayService.feesPendingList(page,size).subscribe(
    (data:any)=>{
      this.feeses=data.response;
      this.feesList=data.totalElements
    }
  )
}
public onChangePage(event: any) {
  this.getAllfeesPayList(event.pageIndex, event.pageSize);
}

isFieldInvalidForPayFeesForm(fieldName: string): boolean {
  const field = this.payFeesForm.get(fieldName);
  return field ? field.invalid && field.touched : false;
}

public feesPayDetailsFormSubmition() {
  Object.keys(this.payFeesForm.controls).forEach(key => {
    const control = this.payFeesForm.get(key);
    if (control) {
      control.markAsTouched();
    }
  });
  const firstInvalidControl = document.querySelector('input.ng-invalid');
  if (firstInvalidControl) {
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

feesPay(){
  this.payFeesForm.markAllAsTouched();
  if (this.payFeesForm.valid &&  !(this.fees.remainingFees<this.feesPays.feesPayAmount) )
  
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

public getFeesById(feesId:number){
  this.feesService.findByFeesId(feesId).subscribe({
    next:(data:any)=>{
     this.fees = data
     console.log(this.fees);
     
     this.feesPays.fees =this.fees
    }
  })
}

public searchByName(){

  if(this.search=='')
  this.getAllfeesPayList(0,8);
else{
  this.feesService.searchByName(this.search,'Pending').subscribe(
    (data:any)=>{
      this.feeses=data;
      this.feesList=data.totalElements;
    }
  )
}
}

public findByGivenDate(){
  if(this.startDate=='' && this.endDate == ''){
    this.getAllfeesPayList(0,8);
  }else{
    this.feesService.findByDate(this.startDate,this.endDate,'Pending').subscribe(
      (data:any)=>{
        this.feeses=data;
        this.feesList-data.totalElements
      }
    )
  }
}


}
