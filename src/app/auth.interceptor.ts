import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { StudentService } from './service/student.service';
import { LoaderServiceService } from './service/loader-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private studentService: StudentService, private loaderService: LoaderServiceService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url != 'http://worldtimeapi.org/api/ip') {
      let authReq = request;
      //consolex.log('inside interceptor')
      //add the jwt token(localstorage) request
      const token = this.studentService.getToken();
      this.loaderService.show()

      if (token != null) {
        authReq = authReq.clone({
          setHeaders: { Authorization: `${token}` }
        });
      }
      return next.handle(authReq).pipe(
        finalize(() => this.loaderService.hide()));
    }
    return next.handle(request);
  }
}
export const authInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];
