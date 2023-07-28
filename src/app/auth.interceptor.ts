import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentService } from './service/student.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private studentService:StudentService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url != 'http://worldtimeapi.org/api/ip'){
      let authReq = request;
    //console.log('inside interceptor')
    //add the jwt token(localstorage) request
    const token = this.studentService.getToken();
    
    if(token!=null){
        authReq = authReq.clone({
            setHeaders:{Authorization: `${token}`}
        });
    }
    return next.handle(authReq);
    }
    return next.handle(request);
  }
}
export const authInterceptorProvider = [
  {
      provide:HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
  },
];
