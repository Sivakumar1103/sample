import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  retrieveNotifications() {
    return this.http.get<ApiResponse>(`${environment.notification}/list`);
  }

  updateNotification(notifData: any) {
    return this.http.post<ApiResponse>(`${environment.notification}/update`,notifData);
  }
}
