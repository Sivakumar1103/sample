import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { environment } from 'src/environments/environment';
import { DeleteService } from 'src/app/services/delete.service';
import { AuthService } from '../../../services/usermanagement/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { ManageaccountService } from 'src/app/services/manageaccount.service';


@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.component.html',
  styleUrls: ['./accountsettings.component.scss']
})
export class AccountsettingsComponent implements OnInit {
  userData: User = new User();
  
  deleteForm: FormGroup;
  tabName = 'personal';
  UserData = {};
  user = {};
  deleteData = {};
  deleteUser = {};
  loginForm!: FormGroup;
  submitted = false;
  loginUserData = { username: '', password: '' }
  public errormessage: boolean = false;

  public clicked: boolean = false;

  constructor(private formBuilder: FormBuilder,
    public profileService: ProfileService,
    public DeleteService: DeleteService,
    private _auth: AuthService,
    public authServiceAK: AuthService, 
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    )
    
    { 
      this.deleteForm = new FormGroup
      ({
        email: new FormControl('', Validators.required),
      });
      this.deleteForm.controls['email'].disable();
      token: String; }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.spinner.show();
    
    if (!this.profileService.userData.firstName) {
      this.profileService.retrieveUserProfile().subscribe(res => {
        this.profileService.userData = res.data;
        this.spinner.hide();
      });
    }
  }
  get f() { return this.loginForm.controls; }
  clickMethod() {
    this.submitted = true;
    if ((this.loginUserData.username == '' && this.loginUserData.password == '') || (this.loginUserData.username == '') || (this.loginUserData.password == '')) {
      console.log("empty string");
      return;
    }
    this.spinner.show();
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.profileService.userData = res.data;
      this.spinner.hide();
    });
    this.spinner.show();
    this._auth.loginUser(this.loginUserData).subscribe(res => {
      this.spinner.show();
      this.DeleteService.functionName(this.deleteData).subscribe(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRefToken');
        this.router.navigate(['/message'])
        this.spinner.hide();
      }, err => {
        this.toastr.error('User Deleted Failed');
      }
      );
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        console.log(err);
        this.toastr.error('Login Attempt Failed', 'Incorrect UserName or Password');
        this.loginForm.controls['username'].enable();
        this.loginForm.controls['password'].enable();
      }

    );

  }
}
