import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/user';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: User = new User();

  constructor(private http: HttpClient,
    private _router: Router,
    private socialAuthService: SocialAuthService) { token: String; }

  registerUser(user: any) {
    return this.http.post<any>(`${environment.userManagement}/createUser`, user)
  }

  registerSocialUser(user: any) {
    return this.http.post<any>(`${environment.userManagement}/authenticateScUser`, user)
  }

  loginUser(user: any) {
    return this.http.post<any>(`${environment.userManagement}/authenticateUser`, user)
  }

  updateUser(user: any){
    return this.http.post<any>(`${environment.userManagement}/updateUser`, user)
  }

  forgotUser(user: any){
    return this.http.post<any>(`${environment.userManagement}/forgotPassword`, user)
  }

  changePassword(user: any){
    return this.http.post<any>(`${environment.userManagement}/changePassword `, user)
  }

  loggedIn() {
    return !!(localStorage.getItem('token') && localStorage.getItem('userToken'))
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getUserToken() {
    return localStorage.getItem('userToken')
  }

  removeUserToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    this.socialAuthService.signOut();
  }

  logoutUser() {
    this.removeUserToken();
    this._router.navigate(['/message'])
  }

  signInWithGoogle(): Promise<SocialUser> {
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): Promise<SocialUser> {
    return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }

}
