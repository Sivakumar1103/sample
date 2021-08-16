import { Injectable } from '@angular/core';
import { CanActivate, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { NewtemplateComponent } from '../components/template/newtemplate/newtemplate.component';
import { AuthService } from '../services/usermanagement/auth.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService,
    private _router: Router) {}

    canActivate(): boolean
    {
      if(this._authService.loggedIn())
      {
        return true
      }
      else
      {
        this._router.navigate(['/login'])
        return false
      }
    }

    canDeactivate(component: NewtemplateComponent): any | Observable<any>{
      
      if(component.canDeactivate()) {
        return true;
      }
      else{
        // return confirm('Do you want to exit with out save');
        let promise=new Promise((resolve:any,reject:any)=>{
          Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
               resolve(true);
            }
            else{
              resolve(false);
            }
          })



        });
        promise.then((result:any)=>{
          return result;
        })
        return promise;
      }
    }
}
