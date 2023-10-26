import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { QRServiceService } from 'src/app/service/qrservice.service';
import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ChatServiceService } from 'src/app/service/chat-service-service.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login-qr',
  templateUrl: './login-qr.component.html',
  styleUrls: ['./login-qr.component.scss']
})
export class LoginQRComponent implements OnInit {

  qrImage = '';
  qrKey = '';
  stompClient: any = null;
  connection = false

  BASE_URL = this.utilityService.getBaseUrl();
  userAgent: any
  connected!: boolean;
  subscription!: Subscription;

  constructor(public qrService: QRServiceService, private loginService: LoginService, private router: Router, private utilityService: UtilityServiceService, private deviceService: DeviceDetectorService, private chatService: ChatServiceService) { }
  ngOnInit(): void {
   // console.log(this.deviceService.getDeviceInfo())
    this.qrService.generateQRCode().subscribe({
      next: (data: any) => {
        this.qrImage = data.qrData;
        this.qrKey = data.qrKey;
        this.qrKey = this.qrKey.split('#')[1];
        localStorage.setItem('key', this.qrKey);
        this.connect1();
      }
    });
  }

  public updateLoginStatus(token: string) {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.qrService.updateLoginStatus(deviceInfo, token).subscribe({
      next: (data) => {
     //   console.log("update s" + data);
      }
    })
  }

  disconnect() {
    this.chatService.disconnect();
    this.subscription.unsubscribe();
    this.connection = false;
    this.connected = false;
  }

  public connect1() {
    this.connection = true;
    this.connected = true;
    this.chatService.connectForQr(this.qrKey);
    this.subscription = this.chatService.messages1.subscribe((msg) => {
      if (msg == 'LOGOUT') {
        this.qrService.webLogout().subscribe({
          next: (data) => {
            this.disconnect();
            localStorage.clear();
            this.router.navigate(['']);
          }
        });
        return;
      }
      if (msg !== null && msg !== undefined) {
        this.loginService.setToken(msg);
        this.updateLoginStatus(msg);
        this.router.navigate(['/student']);
      }
    })
  }
}

