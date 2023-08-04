import { Component, OnInit } from '@angular/core';
import { JavaScriptLoaderService } from './service/java-script-loader.service';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { DisableRightClickService } from './service/disable-right-click.service';
import { SocketServiceService } from './service/socket-service.service';
import { QRServiceService } from './service/qrservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CiCO';

  constructor(private jsLoader: JavaScriptLoaderService,private rightClickDisable: DisableRightClickService,
    private loginService:LoginService,
    private router:Router,
    private socketService:SocketServiceService,
    private qrService:QRServiceService) {}

  ngOnInit(): void {
    // this.rightClickDisable.disableRightClick();
    this.jsLoader.ScriptLoader('rightSideBar.js');
      if(this.loginService.isLoggedIn()&&this.loginService.getRole()=='ADMIN'){
        if(!this.loginService.isTokenExpired())
          this.router.navigate(['admin']);
        else{
          this.loginService.logout();
          this.router.navigate(['login']);
        }
      }
      this.qrService.isWebLoggedIn().subscribe({
        next:(data:any)=>{
          if(data.loginDevice == null){
            this.loginService.logout();
            this.router.navigate(['']);
          }else{
            if(this.loginService.isLoggedIn()&&this.loginService.getRole()=='STUDENT'){
              if(!this.loginService.isTokenExpired())
                this.router.navigate(['student']);
              else{
                this.loginService.logout();
                this.router.navigate(['']);
            }
          }
          }
        }
      })
      
  }
}
