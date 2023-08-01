import { UtilityServiceService } from 'src/app/service/utility-service.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Profile } from '../entity/profile';
import { profile } from 'console';

@Injectable({
  providedIn: 'root'
})
export class QRServiceService {

  BASE_URL = this.utilityService.getBaseUrl();
  qrUrl = this.BASE_URL + "/qr"

  profileData: Profile = new Profile();

  constructor(private utilityService: UtilityServiceService, private http: HttpClient) { }

  public generateQRCode() {
    return this.http.get(`${this.qrUrl}/qrGenerator`);
  }

  public qrLogin(token: string): Observable<any> {
    return this.http.post<any>(this.qrUrl + "/clientlogin?token=" + token,
      { headers: { "Content-Type": "application/json; charset=UTF-8" } })
      .pipe(map(response => {
        if (response) {
          localStorage.setItem('token', response.token);
          this.profileData.name = response.name;
          this.profileData.profilePic = response.profilePic;
          this.profileData.id = response.id;
          this.profileData.course = response.course;
        }
        return response;
      }));
  }
  public getProfileData() {
    return this.profileData;
  }
}
