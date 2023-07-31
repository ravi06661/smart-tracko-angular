import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { KafkaServiceService } from 'src/app/service/kafka-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { UtilityServiceService } from 'src/app/service/utility-service.service';

@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.scss']
})
export class LoginQRComponent implements OnInit{

  qrImage='';
  qrKey='';
  stompClient: any = null;

  BASE_URL = this.utilityService.getBaseUrl();
  SOCKET_URL = this.BASE_URL+'/socket';
  constructor(public qrService:QRServiceService,private router:Router,private utilityService:UtilityServiceService){}

  
  ngOnInit(): void {
    this.qrService.generateQRCode().subscribe({
      next:(data:any)=>{
        this.qrImage = data.qrData;
        this.qrKey = data.qrKey;
      }
    });
    this.disconnect();
      this.connect();
  }

  
    connect(){
      var socket = new SockJS(this.SOCKET_URL);
    this.stompClient = Stomp.over(socket);
    let that = this;
    this.stompClient.connect({}, function(frame:any){
      that.stompClient.subscribe('/queue/messages-'+ that.qrKey,
      function(token:any){
        console.log(token);
        
        that.mobileAuthentication(token.body);
        that.disconnect();
      });
    });
  }
  
    mobileAuthentication(token:string){
      this.qrService.qrLogin(token).subscribe(data => {
        this.router.navigate(['/student']);
      });
    }
  
    disconnect(){
      if(this.stompClient !=null){
        this.stompClient.disconnect();
      }
    }
  
  }

