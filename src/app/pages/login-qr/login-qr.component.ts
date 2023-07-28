import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { KafkaServiceService } from 'src/app/service/kafka-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';

@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.scss']
})
export class LoginQRComponent implements OnInit{

  qrImage='';
  constructor(public qrService:QRServiceService,private router:Router){}
  
  ngOnInit(): void {
    this.qrService.generateQRCode().subscribe({
      next:(data:any)=>{
        this.qrImage = data.qrData;
      }
    })

   
  }



  
}
