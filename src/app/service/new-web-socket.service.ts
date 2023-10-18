// import { Injectable } from '@angular/core';
// import { UtilityServiceService } from './utility-service.service';
// import * as SockJS from 'sockjs-client';
// import * as Stomp from "stompjs";
// @Injectable({
//   providedIn: 'root'
// })
// export class NewWebSocketService {

//   BASE_URL = 'localhost:8080'
//   SOCKET_URL = this.BASE_URL+'/socket';
//   constructor(private utilityService: UtilityServiceService) { }

//   socket!: WebSocket;
//   //ws://localhost:8080/socket
//   connect(): void {

//     this.socket = new WebSocket("wss://"+this.SOCKET_URL);
    
//      this.socket.addEventListener('open', (event) => {
//       console.log('WebSocket connection is open.');
//       // You can perform actions after the connection is established here.
//     });
    
//     // WebSocket on error event
//     this.socket.addEventListener('error', (event) => {
//       console.error('WebSocket error:', event);
//       // Handle any errors that occur during the connection.
//     });
    
//     // WebSocket on close event
//     this.socket.addEventListener('close', (event) => {
//       if (event.wasClean) {
//         console.log('WebSocket connection closed cleanly, code:', event.code, 'reason:', event.reason);
//       } else {
//         console.error('WebSocket connection abruptly closed.');
//       }
//       // You can handle the WebSocket close event here.
//     });
//   }

//   sendMessage(message: string): void {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       this.socket.send(message);
//     }
//   }

//   onMessage(callback: (message: string) => void): void {
//     this.socket.onmessage = (event) => {
//       alert(event.data);
//     };
//   }
//   closeConnection() {
//     this.socket.close();
//   }
//   // stompClient: any = null;
//   // connection = false
//   // token: any

//   // connect() {
//   //   var socket = new SockJS(this.SOCKET_URL);
//   //   this.stompClient = Stomp.over(socket);
//   //   let that = this;
//   //   this.stompClient.connect({}, function (frame: any) {
//   //     that.connection = true;
//   //     that.stompClient.subscribe('/queue/messages');
//   //   });
//   // }


















//   qrKey:any;
//   stompClient: any = null;
//   connection = false
//   token:any
//     connect1(){
//       this.qrKey = localStorage.getItem('key');
//       var socket = new SockJS(this.SOCKET_URL);
//     this.stompClient = Stomp.over(socket);

//     let that = this;
//     this.stompClient.connect({}, function(frame:any){
//       that.connection = true;
      
//       that.stompClient.subscribe('/queue/messages-'+ that.qrKey,
//       function(token:any){
//         console.log("socket****"+token.body);
//         if(token.body=='LOGOUT'){
//          that.qrService.webLogout().subscribe({
//           next:(data)=>{
//             localStorage.clear();
//             that.router.navigate(['']);
//             that.stompClient.disconnect();
//           }
//         });
//          return;
//         }
//         that.loginService.setToken(token.body);
//         that.updateLoginStatus(token.body);
//         that.router.navigate(['/student']);
//       });
//     });
//   }

//     disconnect(){
//       if(this.stompClient !=null){
//         this.stompClient.disconnect();
//       }
//     }
  







// }
