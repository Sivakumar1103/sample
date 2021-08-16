import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacebookAKService {

  constructor(private http: HttpClient) { }

  generateAcessToken(accessDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/fb/registerUser`, accessDetails);
  }

  saveUserPages(userId: String, selectedPages: any) {
    return this.http.post<any>(`${environment.socialMedia}/fb/saveUserPages`, { userId, selectedPages });
  }

  postToPage(userAccount: Array<any>, postData: String) {
    return this.http.post<any>(`${environment.socialMedia}/fb/sendUserPost`, { userAccount, postData });
  }

}
