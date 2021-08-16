import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/usermanagement/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  images = ['https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/1055.png', 'https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_1.png', 'https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_2.png','https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_3.png','https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_4.png'];
  public remember: boolean = false;
  login: FormGroup;
  loginUserData = { username: '', password: '' }
  public buttonname: string = 'LOGIN';
  fieldTextType: boolean = false;
  public errormessage: boolean = false;
  public clicked: boolean = false;
  //sitekey:string;

  constructor(private _auth: AuthService,
    private _router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    //private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    config: NgbCarouselConfig) {
    this.login = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, Validators.pattern("((?=.)(?=.*[a-z])(?=.*[A-Z])).{8,}"), Validators.minLength(8)]),
      recaptcha : new FormControl('', Validators.required)
    });

    // {
    //  this.sitekey='6LdgtKYaAAAAACZTsh49b-leT_5tUhCdYmVNzwxB';

   // }
   config.interval = 2000;
   config.keyboard = true;
   config.pauseOnHover = false;

  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    this._auth.removeUserToken();
  }

  OnSubmit() {
    if (this.login.valid) {
      return this.login.value;

    }
  }

  rememberme() {
    this.remember = !this.remember;
  }

  loginUser() {
    this.spinner.show();
    if ((this.loginUserData.username == '' && this.loginUserData.password == '') || (this.loginUserData.username == '') || (this.loginUserData.password == '')) {
      this.errormessage = true;
      this.spinner.hide();
      this.buttonname = 'LOGIN'
    } else {
      this.login.controls['username'].disable();
      this.login.controls['password'].disable();
      this.buttonname = 'SIGNING IN'
      this.clicked = true;
      this._auth.loginUser(this.loginUserData)
        .subscribe(
          res => {
            this.setUserToken(res);
            this.buttonname = 'LOGIN'
            this.clicked = false
            this.spinner.hide();
          },
          err => {
            this.spinner.hide();
            console.log(err);
            this.buttonname = 'LOGIN'
            this.toastr.error('Login Attempt Failed', 'Incorrect UserName or Password');
            this.login.controls['username'].enable();
            this.login.controls['password'].enable();
            this.clicked = false;
          }
        )
    }



  }

  signInWithGoogle(): void {
    this._auth.signInWithGoogle().then(googleResponse => {
      const socialUsr = {
        firstName: googleResponse.firstName,
        lastName: googleResponse.lastName,
        email: googleResponse.email,
        socialLogin: 'google'
      }
      this._auth.registerSocialUser(socialUsr).subscribe(res => {
        if (res.status == 'User not registered with Social Media') {
          this.toastr.error('Login Attempt Failed', 'User is not registered through Google.');
        } else {
          this.setUserToken(res);
        }
      })
    }).catch(err => {
      console.log(err)
    });
  }

  signInWithFB(): void {
    this._auth.signInWithFB().then(fbResponse => {
      console.log(fbResponse);
      const socialUsr = {
        firstName: fbResponse.firstName,
        lastName: fbResponse.lastName,
        email: fbResponse.email,
        socialLogin: 'facebook'
      }
      this._auth.registerSocialUser(socialUsr).subscribe(res => {
        if (res.status == 'User not registered with Social Media') {
          this.toastr.error('Login Attempt Failed', 'User is not registered through Facebook.');
        } else {
          this.setUserToken(res);
        }
      })
    });
  }


  setUserToken(apiResponse: any) {
    localStorage.setItem('token', apiResponse.token)
    localStorage.setItem('userRefToken', apiResponse.data.id)
    localStorage.setItem('userToken', btoa(`${apiResponse.data.email}:password`))
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.profileService.userData = res.data;
    })
    this.spinner.hide();
    if (!!apiResponse.data.changePassword) {
      this._router.navigate([`passwordupdate`])
    } else {
      this._router.navigate([`home/${apiResponse.data.id}/dashboard`])
    }

  }



}
