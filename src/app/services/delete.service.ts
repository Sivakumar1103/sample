import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialProfile } from 'src/app/model/socialProfile';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {


  constructor(private http: HttpClient) { }

  functionName(User:any){
    return this.http.post<any>(`${environment.userManagement}/deleteUser`, User)
  }
}
