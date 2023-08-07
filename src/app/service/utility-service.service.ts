import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  constructor() { }




 // private BASE_URL = 'http://cicoapi.dollopinfotech.com';

  // private BASE_URL = 'http://localhost:8080';
  private BASE_URL = 'http://192.168.1.30:8080';
  private readonly TIME_URL = 'http://worldtimeapi.org/api/ip';

  public getBaseUrl() {
    return this.BASE_URL;
  }
 
  public getTimeUrl() { 
    return this.TIME_URL;
  }
}
