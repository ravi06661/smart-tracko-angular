import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from './login.service';
import { QRServiceService } from './qrservice.service';
import { UtilityServiceService } from './utility-service.service';
import { StudentService } from './student.service';
import { ChatServiceService } from './chat-service-service.service';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  qrKey: any;
  stompClient: any = null;
  connection = false
  token: any
  BASE_URL = this.utilityService.getBaseUrl();
  SOCKET_URL = this.BASE_URL + '/socket';
  constructor(public qrService: QRServiceService,
    private loginService: LoginService,
    private router: Router,
    private utilityService: UtilityServiceService,
    private deviceService: DeviceDetectorService,
    private studentService: StudentService,
    private chatService: ChatServiceService) { }

  subscription!: Subscription;
  public connect() {
    this.qrKey = localStorage.getItem('key');
    this.connection = true;
    this.chatService.connectForQr(this.qrKey);
    this.subscription = this.chatService.messages1.subscribe((msg) => {
      console.log("body", msg);
      if (msg == 'LOGOUT') {
        this.qrService.webLogout().subscribe({
          next: (data) => {
            localStorage.clear();
            this.router.navigate(['']);
            this.chatService.disconnect();
          }

        });
        return;
      }
      if (msg != undefined || msg != null) {
        this.loginService.setToken(msg);
        this.updateLoginStatus(msg);
        this.router.navigate(['/student']);
      }
    })
  }



  public updateLoginStatus(token: string) {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.qrService.updateLoginStatus(deviceInfo, token).subscribe({
      next: (data) => {
        //console.log("update s"+data);
      }
    })
  }

}
