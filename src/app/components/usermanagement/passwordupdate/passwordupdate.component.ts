import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/usermanagement/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { User } from 'src/app/model/user';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-passwordupdate',
  templateUrl: './passwordupdate.component.html',
  styleUrls: ['./passwordupdate.component.scss']
})
export class PasswordupdateComponent implements OnInit {

  changePassword: FormGroup;
  userData!: User;


  constructor(
    private auth: AuthService,
    public profileService: ProfileService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService)
    {
      this.changePassword = new FormGroup
      ({
          email: new FormControl('', Validators.required,),
          oldPassword: new FormControl('', Validators.required),
          newPassword: new FormControl('', Validators.required),
          confirmPassword: new FormControl('', Validators.required)
      });
      this.changePassword.controls['email'].disable();
      this.retrieveUserProfile();
    }

  retrieveUserProfile(): void {
    this.spinner.show();
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.userData = res.data;
      this.spinner.hide();
      this.changePassword.patchValue(res.data)
    })
  }

  OnSubmit() {
    if (this.changePassword.valid) {
      return this.changePassword.value;
    }
  }

  submitChangePassword() {
    this.auth.changePassword(this.changePassword.value)
      .subscribe(
        res => {
            this.toastr.info(res.status,'Reset Password');
            this.router.navigate(['/'])
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
