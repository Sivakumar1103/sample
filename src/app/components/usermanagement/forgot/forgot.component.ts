import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/usermanagement/auth.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  login: FormGroup;
  forgotUserData = { email: ''}

  constructor(private _auth: AuthService,
    private _router: Router, private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService) {
    this.login = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.email])
    })
   }

   OnSubmit() {
    if (this.login.valid) {
      return this.login.value;
    }
  }

   forgotUser() {
    this._auth.forgotUser(this.forgotUserData)
      .subscribe(
        res => {
            this.toastr.info(res.status,'Reset Password');
        },
        err => {
          this.toastr.info('Some error while trying to rest your password. Please contact the support team.','Reset Password')
          console.log(err);
        }
      )
  }

  ngOnInit(): void {
  }

}
