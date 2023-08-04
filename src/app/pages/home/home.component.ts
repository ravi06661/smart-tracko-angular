import { Component, OnInit } from '@angular/core';
import { SocketServiceService } from 'src/app/service/socket-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private socketService:SocketServiceService){}
  ngOnInit(): void {
    this.socketService.connect();
  }
  
}
