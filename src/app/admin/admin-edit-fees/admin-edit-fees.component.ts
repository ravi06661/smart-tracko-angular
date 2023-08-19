import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from 'igniteui-angular';
import { Fees } from 'src/app/entity/fees';
import { FeesPay } from 'src/app/entity/fees-pay';
import { FeesService } from 'src/app/service/fees.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-edit-fees',
  templateUrl: './admin-edit-fees.component.html',
  styleUrls: ['./admin-edit-fees.component.scss']
})
export class AdminEditFeesComponent implements OnInit{
  BASE_URL=this.utilityService.getBaseUrl();  
  imageUrl = this.BASE_URL + '/file/getImageApi/images/';
  feesId:number=0;
  fees:Fees=new Fees();
  constructor(private feesService:FeesService,private utilityService:UtilityServiceService,private activateRoute:ActivatedRoute){}
  ngOnInit(): void {
    this.feesId=this.activateRoute.snapshot.params[('feesId')];
    this.getFeesById();
  }
  
  public updateFees(){
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.feesService.updateFeesDetalis(this.fees).subscribe({
          next:(res:any)=>{
           this.fees=res
          }
          })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        this.getFeesById()
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  

  public getFeesById(){
this.feesService.findByFeesId(this.feesId).subscribe(
  (data:any)=>{
    this.fees=data
    
  }
)
  }
}
