import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  constructor() { }




  private BASE_URL = 'http://cicoapi.dollopinfotech.com';
  //private BASE_URL = 'http://localhost:8080';
  //private BASE_URL = 'http://192.168.1.30:8080';
  private readonly TIME_URL = 'http://worldtimeapi.org/api/ip';

  public getBaseUrl() {
    return this.BASE_URL;
  }

  public getTimeUrl() {
    return this.TIME_URL;
  }

  public updateTimeline(date: any) {
    // Calculate the time difference and update the timestamp
    const now = new Date();
    const messageDate = new Date(date); // Replace with the actual message date
    const timeDiff = now.getTime() - messageDate.getTime();

    // Calculate hours and minutes
    const hours = Math.floor(timeDiff / 3600000);
    const minutes = Math.floor((timeDiff % 3600000) / 60000);
    const day = Math.floor(hours / 24)

    if (hours > 0 && hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (day > 0) {
      return `${day} ${day === 1 ? 'day' : 'days'} ago`
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  }

  // decodeFromBase64(encodedString: string): ArrayBuffer {
  //   return decode(encodedString);
  // }

  // encodeToBase64(data: ArrayBuffer): string {
  //   return encode(data);
  // }
}


