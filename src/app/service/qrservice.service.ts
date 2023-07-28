import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QRServiceService {

  BASE_URL=this.utilityService.getBaseUrl();
  qrUrl=this.BASE_URL+"/qr"

  constructor(private utilityService:UtilityServiceService,private http:HttpClient) { }

  public generateQRCode(){
    return this.http.get(`${this.qrUrl}/qrGenerator`);
  }
}
