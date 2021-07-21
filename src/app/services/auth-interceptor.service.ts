import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { tap } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(public authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let storage = localStorage;

    if (storage.getItem("token")) {
      request = request.clone({
        setHeaders: {
          "Authorization": `Bearer ${storage.getItem("token") ? storage.getItem("token") : ''}`,
          Accept: "*/*"
        }
      });
    }
    if (storage.getItem("access_token")) {
      request = request.clone({
        setHeaders: {
          // "X-API-Client": "sbic",
          "access-token": storage.getItem("access_token"),
          "Authorization": `Bearer ${storage.getItem("token") ? storage.getItem("token") : ''}`,
          Accept: "*/*"
        }
      });
    }
    return next.handle(request).pipe(
      tap(
        (response: HttpEvent<any>) => {
          // console.log(response);
        },
        (error: HttpErrorResponse) => {
          if (error["status"] == 401) {
            this.authService.logout();
            this.router.navigateByUrl('/');
          }
        }
      )
    );
  }
}
