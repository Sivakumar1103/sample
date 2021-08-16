import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/usermanagement/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/')) {
      return next.handle(req).pipe(tap(() => { },
        (err: any) => {
          this.handleAuthError(err);
        }));
    } else {
      let authService = this.injector.get(AuthService)
      let tokenizedReq = req.clone({
        setHeaders:
        {
          authorization: `${authService.getToken() ? authService.getToken() : ''}`,
          userauthdata: `${authService.getUserToken() ? authService.getUserToken() : ''}`
        }
      })
      return next.handle(tokenizedReq).pipe(tap(() => { },
        (err: any) => {
          this.handleAuthError(err);
        }));
    }

  }


  handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      this.router.navigateByUrl(`/login`);
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

}
