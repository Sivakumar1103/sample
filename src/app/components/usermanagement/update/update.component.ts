import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/usermanagement/auth.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit
{

  updateUserData = {firstName: '', lastName: ''}
  update: FormGroup;


  constructor(private _auth: AuthService,
    private _router: Router) {
    this.update = new FormGroup({
      fname: new FormControl ('', Validators.required),
      lname: new FormControl ('', Validators.required)
    })
   }

  ngOnInit(): void {}

   editUser()
  {
    this._auth.updateUser(this.updateUserData)
    .subscribe(
      res => {
        console.log(res)
        localStorage.setItem('token', res.token)
        this._router.navigate(['/special'])
      },
      err =>console.log(err)
    )
    }



  }
