// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { from } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      return from(user.getIdToken()).pipe(
        switchMap(token => {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(authReq);
        })
      );
    }

    return next.handle(req);
  }
}
