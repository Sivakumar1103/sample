import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/usermanagement/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerUserData = { firstName: '', lastName: '', email: '', password: '' }
  msg: string | undefined;
  public errormsg: boolean = false;
  images = ['https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/1055.png', 'https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_1.png', 'https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_2.png','https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_3.png','https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/loginImages/image_4.png'];



  login: FormGroup;

  constructor(private _auth: AuthService,
    private _router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private profileService: ProfileService,
    private dataTransferService: DataTransferService) {
    this.login = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, Validators.pattern("((?=.)(?=.*[a-z])(?=.*[A-Z])).{8,}"), Validators.minLength(8)])
    })
  }

  OnSubmit() {
    if (this.login.valid) {
      console.log(this.validate());
    }
  }
  validate() {
    return this.login.value;
  }

  registerUser() {
    if ((this.registerUserData.firstName == '' && this.registerUserData.lastName == '' && this.registerUserData.email == '' && this.registerUserData.password == '')
      || (this.registerUserData.firstName == '') || (this.registerUserData.lastName == '') ||
      (this.registerUserData.email == '') || (this.registerUserData.password == '')) {
      this.errormsg = true;
      this.spinner.hide();
    }
    else {
      this.spinner.show();
      this._auth.registerUser(this.registerUserData)
        .subscribe(
          res => {
            /* console.log(res)
            localStorage.setItem('token', res.token);
            localStorage.setItem('userRefToken', res.data.id);
            localStorage.setItem('userToken', btoa(`${this.registerUserData.email}:password`)); */
            this.dataTransferService.userEmail = this.registerUserData.email;
            this.spinner.hide()
            this._router.navigate([`emailconfirmation`])
            //this._router.navigate([`home/${res.data.id}/dashboard`])
          },
          err => {
            console.log(err)
            this.spinner.hide();
            this.toastr.error('User already exists', 'Register Attempt Failed');
            this._router.navigate(['/login'])
          })


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
      const socialUsr = {
        firstName: fbResponse.firstName,
        lastName: fbResponse.lastName,
        email: fbResponse.email,
        socialLogin: 'facebook'
      }
      this._auth.registerSocialUser(socialUsr)
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

