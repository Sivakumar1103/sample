import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';
import { SocialProfile } from '../model/socialProfile';

@Injectable({
  providedIn: 'root'
})
export class ManageaccountService {

  userSocialProfile: SocialProfile = {};

  constructor(private http: HttpClient) { }

  retrieveSocialMediaProfile() {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveProfile `);
  }

  removeSocialConnection(socialName: String,userId: String,pageId: String) {
    let paramString = `platform=${socialName}&userId=${userId}`;
    if(pageId) {
      paramString = paramString + `&pageId=${pageId}`;
    }
    return this.http.get<ApiResponse>(`${environment.socialMedia}/removeSocialPlatform?${paramString}`);
  }

}
