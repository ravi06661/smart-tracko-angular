import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { KafkaServiceService } from 'src/app/service/kafka-service.service';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.scss']
})
export class LoginQRComponent implements OnInit{

  qrImage='';
  qrKey='';
  stompClient: any = null;
  connection = false

  BASE_URL = this.utilityService.getBaseUrl();
  SOCKET_URL = this.BASE_URL+'/socket';
  constructor(public qrService:QRServiceService,private loginService:LoginService,private router:Router,private utilityService:UtilityServiceService,private deviceService: DeviceDetectorService){}


  
  ngOnInit(): void {
    console.log(this.deviceService.getDeviceInfo())
    this.qrService.generateQRCode().subscribe({
      next:(data:any)=>{
        this.qrImage = data.qrData;
        this.qrKey = data.qrKey;
        this.qrKey = this.qrKey.split('#')[1];
        localStorage.setItem('key',this.qrKey);
      }
    });
    this.connect();
  }

  
    connect(){
      var socket = new SockJS(this.SOCKET_URL);
    this.stompClient = Stomp.over(socket);
    let that = this;
    this.stompClient.connect({}, function(frame:any){
      that.connection = true;
      
      that.stompClient.subscribe('/queue/messages-'+ that.qrKey,
      function(token:any){
        console.log(token.body);
        if(token.body=='LOGOUT'){
         that.qrService.webLogout().subscribe({
          next:(data)=>{
            localStorage.clear();
            that.router.navigate(['']);
            that.stompClient.disconnect();
          }

        });
         return;
        }
        that.loginService.setToken(token.body);
        that.updateLoginStatus(token.body);
        that.router.navigate(['/student']);
      });
    });
  }
  
  public updateLoginStatus(token:string){
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.qrService.updateLoginStatus(deviceInfo,token).subscribe({
      next:(data)=>{
        console.log("update s"+data);
      }
    })
  }

    // mobileAuthentication(token:string){
    //   const deviceInfo = this.deviceService.getDeviceInfo();
    //   this.qrService.qrLogin(token,deviceInfo).subscribe(data => {
        
    //   });
    // }
  
    disconnect(){
      if(this.stompClient !=null){
        this.stompClient.disconnect();
      }
    }
  
  }

